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

// 1. Initialize transporter OUTSIDE the handler to reuse connection pools
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 2. Prepare both operations
    const dbPromise = Contact.create({ name, email, message });

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

    const mailPromise = transporter.sendMail(mailOptions);

    // 3. Execute in parallel (Performance boost: takes only as long as the slowest operation)
    await Promise.all([dbPromise, mailPromise]);

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Backend Error:', error);
    // Return detailed error for debugging
    return res.status(500).json({ 
      error: 'Backend Failure', 
      message: error.message,
      step: error.stack && error.stack.includes('sendMail') ? 'Sending Email' : 'Saving to Database'
    });
  }
}
