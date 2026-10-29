# Vaibhav Amulani — Engineering Portfolio

A production-grade developer portfolio built with **React 18**, **Vite**, and **Vercel Serverless Functions**. Features an authentic midnight-blue architectural theme (`#060a14`), 3D spatial canvas atmospheres powered by Three.js, live activity integrations with GitHub and LeetCode, verified project showcases, and a hardened contact API.

**Production URL:** [https://vaibhavamulani.vercel.app](https://vaibhavamulani.vercel.app)

---

## 🛠️ Architecture & Tech Stack

### Frontend Core
- **Framework & Tooling:** React 18, Vite 5, ES Modules.
- **Atmosphere & 3D Visuals:** Three.js (`three`) powering 8 distinct spatial canvas layers across sections.
- **Styling:** Modular CSS variable system, midnight-blue color hierarchy, responsive typography with `clamp()`.
- **Icons & Navigation:** `react-icons` (Feather, Simple Icons), `react-scroll` for accessible smooth scrolling.
- **Animation & Transitions:** FLIP shared-name handoff transition, coordinated CSS keyframe sequences, and strict `prefers-reduced-motion` overrides.

### Serverless Backend (`/api`)
- **Contact API (`/api/contact`):** Dual-tier rate limiting (MongoDB atomic TTL with in-memory sliding window fallback), honeypot spam traps, RFC 5322 email validation, HTML escaping, CRLF header injection mitigation, and Nodemailer dispatch via Gmail SMTP.
- **GitHub Metrics (`/api/github`):** Edge-cached endpoint parsing public contribution calendars and repository metadata with safe fallback handling.
- **LeetCode Metrics (`/api/leetcode`):** Normalized GraphQL consumer extracting active days, submission streak, difficulty breakdown, and numeric ranking.

---

## 📂 Repository Structure

```text
Portfolio/
├── api/                     # Vercel serverless function handlers
│   ├── contact.js           # Hardened email dispatch & contact endpoint
│   ├── github.js            # GitHub profile and contribution heatmap API
│   └── leetcode.js          # LeetCode metrics and submission calendar API
├── public/                  # Static assets (PDF certificates, project previews)
│   ├── certificates/        # Verified course and internship credentials (PDF)
│   ├── robots.txt           # Crawl directives and sitemap reference
│   └── sitemap.xml          # XML sitemap for search indexation
├── scripts/                 # Quality gates and automated test suites
│   ├── test-apis.js         # 61 assertions for GitHub/LeetCode APIs & parsers
│   ├── verify-contact-security.js # 10 assertions for contact security & rate limits
│   ├── verify-ratelimit-deep.js   # Concurrency & IP spoofing validation
│   ├── verify-jsx-imports.js      # Static JSX import & binding verifier
│   └── verify_pdfs.mjs      # Header & HTTP verification for downloadable assets
├── src/
│   ├── components/          # Reusable UI sections and Three.js 3D canvases
│   ├── data/                # Static snapshots and baseline portfolio dataset
│   ├── utils/               # Helper routines (commit metadata, etc.)
│   ├── App.jsx              # Application lifecycle, scroll restoration & intro coordinator
│   └── main.jsx             # React DOM entry point
├── vercel.json              # Edge routing, CSP, cache headers & security directives
└── vite.config.js           # Vite build pipeline and proxy configuration
```

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Gmail Account:** For contact form SMTP (requires an App Password)
- **MongoDB Atlas (Optional):** For distributed contact persistence and rate limiting (in-memory fallback is active by default)

### 2. Installation
```bash
git clone https://github.com/Vaibhav2176/Portfolio.git
cd Portfolio
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:
```env
# Server-Side Email Delivery (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=recipient_email@gmail.com

# Server-Side Optional MongoDB Persistence (Optional)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# Local Development Server Port
PORT=3000

# Client-Side Frontend API Configuration (Optional)
# Leave empty for Vercel production deployments to use relative /api routes.
VITE_API_URL=
```

### 4. Running Locally
```bash
# Start frontend Vite development server (http://localhost:5173)
npm run dev

# Start optional local Express API server (http://localhost:3000)
npm run server

# Run both frontend and backend concurrently
npm run dev-all
```

---

## 🧪 Testing & Quality Gates

The repository includes dedicated automated test suites covering API contracts, rate limiting, security controls, and asset integrity:

```bash
# Run API integration and normalization tests (61 assertions)
node scripts/test-apis.js

# Run contact API security and rate-limiting tests (10 assertions)
npm run test:contact

# Run deep rate-limiting and concurrency verification (8 assertions)
node scripts/verify-ratelimit-deep.js

# Run JSX import integrity check & ESLint (0 errors, 0 warnings)
npm run lint

# Run production build compilation
npm run build
```

---

## 🔒 Security Controls & Hardening

1. **Content Security Policy (CSP):** Strict CSP enforced via `vercel.json` restricting scripts, frames, objects, and connect sources.
2. **HTTP Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
3. **Contact Validation:** Strict field type and length checks (name: 2–100, email: 5–254, message: 10–5000), input sanitization against CRLF injection, and full HTML entity escaping.
4. **Honeypot & Rate Limiting:** Bot detection via a hidden honeypot trap; sliding rate limiter enforcing a maximum of 5 submissions per 15-minute window per IP.
5. **Safe Fallbacks:** Sensitive error messages and stack traces are never exposed in API responses.

---

## ☁️ Deployment

The application is deployed on **Vercel** with automatic continuous deployment from the `main` branch.
- Serverless endpoints in `api/` are automatically mapped to `/api/*`.
- Static assets in `public/` are served with caching headers configured in `vercel.json`.
- SPA client-side routing is handled via Vercel rewrites.

---

## 📄 License
MIT License — Copyright (c) 2026 Vaibhav Amulani.
