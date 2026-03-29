import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// MongoDB Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// Cached connection variable for serverless functions
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("CRITICAL: MONGO_URI environment variable is missing!");
        return;
    }

    try {
        const db = await mongoose.connect(uri, {
            family: 4,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connection Established");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        throw err;
    }
};

// Initialize transporter outside the handler for reuse
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  const requestStart = Date.now();
  console.log(`\n[${new Date().toISOString()}] New Contact Request Started`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 1. Ensure DB Connection
    const dbConnStart = Date.now();
    await connectDB();
    console.log(`Step 1: DB Connection took ${Date.now() - dbConnStart}ms`);

    // 2. Prepare Operations
    const opsStart = Date.now();
    
    // DB Save Promise
    const dbPromise = Contact.create({ name, email, message }).then(() => {
        console.log(`Step 2a: MongoDB Write finished in ${Date.now() - opsStart}ms`);
    });

    // Email Promise
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Portfolio Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    const mailPromise = transporter.sendMail(mailOptions).then(() => {
        console.log(`Step 2b: Email Delivery finished in ${Date.now() - opsStart}ms`);
    });

    // 3. Parallel Execution
    await Promise.all([dbPromise, mailPromise]);

    const totalTime = Date.now() - requestStart;
    console.log(`[SUCCESS] Message sent in ${totalTime}ms total.`);

    return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully!',
        debug_time: totalTime
    });

  } catch (error) {
    const errorTime = Date.now() - requestStart;
    console.error(`[ERROR] after ${errorTime}ms:`, error.message);
    
    return res.status(500).json({ 
      error: 'Backend Failure', 
      message: error.message,
      debug_step: error.stack && error.stack.includes('sendMail') ? 'Email' : 'Database',
      debug_time: errorTime
    });
  }
}
