# Professional Portfolio Website

A premium, modern developer portfolio built with **React (Vite)** and **Express**. Featuring a sleek dark-themed UI, glassmorphism, smooth animations, and a functional backend for contact form submissions.

## 🚀 Features
- **Modern UI**: Dark-mode aesthetic with glassmorphism and neon gradients.
- **Dynamic Projects**: Interactive cards with hover effects and repository stats.
- **Typewriter Animation**: Engaging hero section with developer-centric phrases.
- **Functional Backend**: Express + MongoDB API for contact form persistence.
- **Email Notifications**: Immediate alerts via Nodemailer (Gmail SMTP).
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Deployment Ready**: Pre-configured for Vercel Serverless Functions.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Framer Motion, React Icons, React Scroll.
- **Backend**: Express, Mongoose (MongoDB), Nodemailer.
- **Styling**: Vanilla CSS (Custom Variable System).

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Gmail Account (for SMTP)

### 2. Installation
```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 3. Environment Variables
Create a `.env` file in the root:
```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=recipient_email_address
```

### 4. Running Locally
```bash
# Start both Frontend and Backend concurrently
npm run dev-all
```

## ☁️ Deployment
This project is optimized for **Vercel**:
1. Connect your repository to Vercel.
2. Add the environment variables from your `.env` to the Vercel Dashboard.
3. Deploy! The `/api` directory will automatically become Serverless Functions.

## 📄 License
MIT License - Developed by Vaibhav Amulani.
