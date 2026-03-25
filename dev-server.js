import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from './api/contact.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mock Vercel req/res for the handler
app.post('/api/contact', async (req, res) => {
  // Translate express res.status().json() to be compatible with vercel handler if needed
  // In this case, they are mostly compatible
  await handler(req, res);
});

app.listen(port, () => {
  console.log(`Backend Dev Server running at http://localhost:${port}`);
});
