import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/contact.js';
import leetcodeHandler from './api/leetcode.js';
import githubHandler from './api/github.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS for production & local dev
const allowedOrigins = [
  'http://localhost:5173', // Local Vite
  'http://localhost:3000', // Local Server
  'https://vaibhavamulani.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = !origin || 
      allowedOrigins.includes(origin) ||
      (typeof origin === 'string' && origin.endsWith('.vercel.app'));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Health check
app.get('/', (req, res) => {
  res.send('Portfolio Backend is running...');
});

// Contact API Route
app.post('/api/contact', async (req, res) => {
  await handler(req, res);
});

// LeetCode API Route
app.get('/api/leetcode', async (req, res) => {
  await leetcodeHandler(req, res);
});

// GitHub API Route
app.get('/api/github', async (req, res) => {
  await githubHandler(req, res);
});

// Database Connection (Optional persistence)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const startServer = () => {
  app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
  });
};

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  })
  .then(() => {
    console.log("MongoDB Connected");
    startServer();
  })
  .catch(err => {
    console.warn("MongoDB Connection Warning (server continuing):", err.message);
    startServer();
  });
} else {
  console.log("MONGO_URI not configured. Starting backend server with email delivery enabled.");
  startServer();
}
