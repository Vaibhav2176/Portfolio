import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// ============================================================================
// STAGE 5 — HARDENED CONTACT HANDLER (Vercel Serverless & Express compatible)
// Robust validation, HTML escaping, header injection defense, and rate limiting
// ============================================================================

// --- Rate Limiting Configuration ---
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// --- Tier 1 & Tier 2 Rate Limiter State ---
const ipRequestHistory = new Map();

export function isRateLimitedInMemory(ip) {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  
  // Retain only requests within the current rolling window
  const recent = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, recent);
    return true;
  }
  
  recent.push(now);
  ipRequestHistory.set(ip, recent);

  // Periodic cleanup to avoid memory leaks
  if (ipRequestHistory.size > 5000) {
    for (const [key, times] of ipRequestHistory.entries()) {
      const valid = times.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) ipRequestHistory.delete(key);
      else ipRequestHistory.set(key, valid);
    }
  }

  return false;
}

// Concurrency-safe atomic MongoDB rate limiter schema & model
const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  count: { type: Number, required: true, default: 0 },
  resetAt: { type: Date, required: true, index: true }
});
rateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB TTL cleanup

export const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);

/**
 * Robust IP Extraction with spoofing mitigation
 */
export function extractClientIp(req) {
  const raw = req.headers?.['x-real-ip'] ||
              req.headers?.['x-forwarded-for']?.split(',')[0] ||
              req.socket?.remoteAddress ||
              '127.0.0.1';
  const cleaned = String(raw).trim().replace(/^::ffff:/, '');
  return /^[a-zA-Z0-9.:%_-]+$/.test(cleaned) ? cleaned : '127.0.0.1';
}

/**
 * Dual-Tier Concurrency-Safe Rate Limiter
 * 1. Distributed Atomic MongoDB (when connected in serverless production)
 * 2. In-Memory Sliding Window (local dev, single-instance, or fallback on DB downtime)
 */
export async function checkRateLimit(clientIp) {
  if (isConnected && mongoose.connection.readyState === 1) {
    try {
      const now = new Date();
      const resetAt = new Date(Date.now() + RATE_LIMIT_WINDOW_MS);

      // 1. Atomically increment if window is active and quota remains
      let record = await RateLimit.findOneAndUpdate(
        { key: clientIp, resetAt: { $gt: now }, count: { $lt: MAX_REQUESTS_PER_WINDOW } },
        { $inc: { count: 1 } },
        { new: true }
      );

      if (record) {
        return { isLimited: false, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
      }

      // 2. Atomically reset if existing window has expired
      record = await RateLimit.findOneAndUpdate(
        { key: clientIp, resetAt: { $lte: now } },
        { $set: { count: 1, resetAt } },
        { new: true }
      );

      if (record) {
        return { isLimited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
      }

      // 3. Atomically initialize if key does not exist yet
      try {
        record = await RateLimit.create({ key: clientIp, count: 1, resetAt });
        return { isLimited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
      } catch (createErr) {
        // Race condition / duplicate key on concurrent insert: find existing and verify limit
        const existing = await RateLimit.findOne({ key: clientIp });
        if (existing && existing.resetAt > now && existing.count >= MAX_REQUESTS_PER_WINDOW) {
          return { isLimited: true, remaining: 0 };
        }
        const inc = await RateLimit.findOneAndUpdate(
          { key: clientIp, resetAt: { $gt: now }, count: { $lt: MAX_REQUESTS_PER_WINDOW } },
          { $inc: { count: 1 } },
          { new: true }
        );
        return { isLimited: !inc, remaining: inc ? MAX_REQUESTS_PER_WINDOW - inc.count : 0 };
      }
    } catch (dbErr) {
      console.warn('[CONTACT API] Distributed rate limit check failed, falling back to in-memory:', dbErr.message);
    }
  }

  // Tier 2: In-memory sliding window
  const limited = isRateLimitedInMemory(clientIp);
  return { isLimited: limited, remaining: limited ? 0 : 1 };
}

// --- Sanitization & Security Helpers ---
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHeader(str) {
  if (typeof str !== 'string') return '';
  // Strip carriage returns, line feeds, and null bytes to prevent CRLF injection
  return str.replace(/[\r\n\0]/g, ' ').trim();
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  // RFC 5322 compliant regex for practical email address validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

// --- MongoDB Persistence (Graceful & Non-blocking) ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return; // DB is optional; email delivery is primary

  try {
    const db = await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    console.warn('[CONTACT API] Optional MongoDB connection skipped:', err.message);
  }
};

// --- Nodemailer Transporter Configuration ---
let cachedTransporter = null;
function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null; // Will trigger configuration error if called
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  return cachedTransporter;
}

// --- Handler Export ---
export default async function handler(req, res) {
  // Ensure DB connection if configured (non-blocking)
  await connectDB();

  // 1. CORS Preflight & Headers
  const origin = req.headers?.origin || '';
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vaibhavamulani.vercel.app'
  ];
  
  const isVercelDomain = typeof origin === 'string' && origin.endsWith('.vercel.app');
  if (allowedOrigins.includes(origin) || isVercelDomain || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 2. HTTP Method Enforcement
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 3. Content-Type Check
  const contentType = req.headers?.['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ error: 'Unsupported Media Type. Expected application/json.' });
  }

  // 4. Rate Limiting Check (Atomic & Distributed with In-Memory fallback)
  const clientIp = extractClientIp(req);
  const rateLimitStatus = await checkRateLimit(clientIp);

  if (rateLimitStatus.isLimited) {
    res.setHeader('Retry-After', '900');
    return res.status(429).json({ 
      error: 'Too many requests. Please wait 15 minutes before sending another message.' 
    });
  }

  // 5. Request Body Existence & Type Checks
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Malformed request body.' });
  }

  const { name, email, message, website } = body;

  // 6. Honeypot Spam Check (Field `website` is invisible to human users)
  if (website && typeof website === 'string' && website.trim().length > 0) {
    // Silently acknowledge without processing to deter bot retry loops
    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  }

  // 7. Field Type & Existence Checks
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'All fields (name, email, message) must be strings.' });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: 'Name, email, and message cannot be empty or whitespace only.' });
  }

  // 8. Length Boundary Checks
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return res.status(400).json({ error: 'Name must be between 2 and 100 characters.' });
  }

  if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
    return res.status(400).json({ error: 'Email must be between 5 and 254 characters.' });
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
    return res.status(400).json({ error: 'Message must be between 10 and 5000 characters.' });
  }

  // 9. Format & Header Injection Checks
  if (!isValidEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const safeName = sanitizeHeader(trimmedName);
  const safeEmail = sanitizeHeader(trimmedEmail);

  if (!safeName || !safeEmail) {
    return res.status(400).json({ error: 'Input contains invalid or prohibited control characters.' });
  }

  // 10. Email Dispatch & Optional DB Write
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.error('[CONTACT API] EMAIL_USER or EMAIL_PASS environment variable is not configured.');
      return res.status(500).json({ 
        error: 'Contact service is temporarily misconfigured. Please email directly at vaibhav2176a@gmail.com' 
      });
    }

    // HTML & Plain Text construction
    const escapedName = escapeHtml(safeName);
    const escapedEmail = escapeHtml(safeEmail);
    const escapedMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br />');

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: `"${safeName}" <${safeEmail}>`,
      subject: `Portfolio Message from ${safeName}`,
      text: `New Portfolio Message\n\nName: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${trimmedMessage}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0b1120; margin-top: 0; font-size: 20px;">New Portfolio Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 80px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; color: #0b1120; font-size: 14px;">${escapedName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #0b1120; font-size: 14px;"><a href="mailto:${escapedEmail}" style="color: #2563eb;">${escapedEmail}</a></td>
            </tr>
          </table>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapedMessage}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
            Sent from Vaibhav Amulani Portfolio contact form.
          </p>
        </div>
      `
    };

    // Parallel execution with optional MongoDB write
    const emailPromise = transporter.sendMail(mailOptions);
    const dbPromise = connectDB().then(() => {
      if (isConnected && mongoose.connection.readyState === 1) {
        return Contact.create({ 
          name: safeName, 
          email: safeEmail, 
          message: trimmedMessage 
        }).catch(err => {
          console.warn('[CONTACT API] Optional MongoDB write skipped:', err.message);
        });
      }
    });

    await Promise.all([emailPromise, dbPromise]);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! I will get back to you shortly.'
    });

  } catch (error) {
    // Server-side logging without leaking credentials or message contents
    console.error('[CONTACT API ERROR]', error.code || 'Delivery Failure', error.message);

    // Client-safe response: never expose stack traces or SMTP internal errors
    return res.status(500).json({
      error: 'Failed to deliver message. Please reach out directly via email at vaibhav2176a@gmail.com'
    });
  }
}
