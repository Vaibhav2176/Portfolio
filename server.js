import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/contact.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS for production
const allowedOrigins = [
  'http://localhost:5173', // Local Vite
  'http://localhost:3000', // Local Server
  /\.vercel\.app$/          // Any Vercel deployment
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Portfolio Backend is running...');
});

// Contact API Route
app.post('/api/contact', async (req, res) => {
  await handler(req, res);
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is missing in environment variables!");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log("MongoDB Connected");
  app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
  });
})
.catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});
