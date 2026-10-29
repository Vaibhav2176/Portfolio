import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/contact.js';
import leetcodeHandler from './api/leetcode.js';
import githubHandler from './api/github.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
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

app.listen(port, () => {
  console.log(`Backend Dev Server running at http://localhost:${port}`);
});
