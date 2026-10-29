// ==========================================================================
// PORTFOLIO CENTRAL DATA MODEL — STAGE 3
// Source of Truth: Portfolio Redesign Master Specification
// ==========================================================================

export const personalInfo = {
  name: "Vaibhav Amulani",
  role: "Software Engineering Student",
  headline: "Building real web products, backend systems, and applied AI tools.",
  bio: "B.Tech Computer Science & Engineering student at LNCTS Bhopal with an 8.25 CGPA. Focused on full-stack web applications, deterministic system engineering, and practical AI integrations.",
  location: "Bhopal, India",
  email: "vaibhav2176a@gmail.com",
  phone: "+91 7024057876",
  whatsappUrl: "https://wa.me/917024057876?text=Hi%20Vaibhav,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect.",
  github: "https://github.com/Vaibhav2176",
  linkedin: "https://www.linkedin.com/in/vaibhav-amulani-72aaab248/",
  leetcode: "https://leetcode.com/u/OerRUe2yaA/",
  twitter: "https://x.com/VaibhavAmulani",
  instagram: "https://www.instagram.com/_vaibhav_amulani/",
  resumePdf: "/Vaibhav_Amulani_Resume_2_page.pdf",
  portraitImage: "/Cinematic Blue-Toned Professional Portrait.png",
  currentCgpa: "8.25",
  college: "LNCTS Bhopal",
  degree: "B.Tech in Computer Science & Engineering (2024–2028)"
};

export const projectsData = [
  {
    id: "rays-academy",
    title: "Rays Academy",
    tagline: "Commercial Education Portal & Study Marketplace",
    category: "Full Stack & E-Commerce",
    status: "Live in Production",
    statusType: "live",
    accent: "cyan",
    previewImage: "/projects/rays-academy-preview.png",
    description: "A full-stack coaching and academic portal developed for Rays Academy in Bhopal, providing students with structured course information and secure, self-service access to study materials.",
    capabilities: [
      {
        title: "Protected Study-Material Downloads",
        detail: "Delivers purchased courseware via short-lived, cryptographically signed URLs to prevent unauthorized file sharing."
      },
      {
        title: "Automated Razorpay Checkout",
        detail: "Processes course purchases through secure webhooks with idempotent database verification to guarantee reliable order fulfillment."
      },
      {
        title: "Role-Based Content Access",
        detail: "Restricts academic notes and test series behind PostgreSQL Row-Level Security policies tied to verified student enrollments."
      }
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Razorpay"],
    live: "https://www.raysacademybhopal.in/",
    liveLabel: "Live Platform",
    github: "https://github.com/Vaibhav2176/rays-academy-renaissance",
    githubLabel: "Source Code",
    repo: "Vaibhav2176/rays-academy-renaissance",
    statusNote: null,
    floatingPanels: [
      {
        id: "rays-commit",
        type: "github-commit",
        position: "top-right",
        icon: "git-commit",
        label: "Latest Commit",
        fallbackValue: "Automated Razorpay Webhooks",
        accent: "cyan"
      },
      {
        id: "rays-security",
        type: "feature",
        position: "bottom-left",
        icon: "shield",
        label: "Access Control",
        value: "Signed Download URLs",
        accent: "emerald"
      }
    ]
  },
  {
    id: "toolverse",
    title: "ToolVerse",
    tagline: "High-Performance Web Utilities Suite",
    category: "Web Application & Architecture",
    status: "Live in Production",
    statusType: "live",
    accent: "emerald",
    previewImage: "/projects/toolverse-preview.png",
    description: "A fast, privacy-first online toolkit offering over 133 instant developer utilities, formatters, cryptography tools, and financial calculators with zero account setup.",
    capabilities: [
      {
        title: "100% In-Browser Execution",
        detail: "All data transformations, hashing, and calculations execute entirely in client-side JavaScript with zero remote latency."
      },
      {
        title: "Complete Data Privacy",
        detail: "User inputs and sensitive texts never leave the browser or get transmitted to any cloud servers."
      },
      {
        title: "Modular Dynamic Loading",
        detail: "Route-level code splitting ensures individual utilities load on demand without inflating the initial page bundle."
      }
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"],
    live: "https://toolverse-hub.vercel.app/",
    liveLabel: "Open Platform",
    github: "https://github.com/Vaibhav2176/toolverse-hub",
    githubLabel: "Source Code",
    repo: "Vaibhav2176/toolverse-hub",
    statusNote: null,
    floatingPanels: [
      {
        id: "toolverse-engine",
        type: "feature",
        position: "top-left",
        icon: "zap",
        label: "Execution Engine",
        value: "100% In-Browser Execution",
        accent: "emerald"
      },
      {
        id: "toolverse-density",
        type: "feature",
        position: "bottom-right",
        icon: "cpu",
        label: "Tool Density",
        value: "133+ Utilities Live",
        accent: "cyan"
      }
    ]
  },
  {
    id: "netsage-ai",
    title: "NetSage AI",
    tagline: "Network Diagnostics & Remediation Assistant",
    category: "AI & Systems Engineering",
    status: "Open Source Tool",
    statusType: "tool",
    accent: "amber",
    previewImage: null,
    description: "An AI-assisted network troubleshooting tool that identifies connectivity faults through deterministic pattern matching, paired with optional Gemini AI remediation.",
    capabilities: [
      {
        title: "Deterministic Rule Engine",
        detail: "Analyzes router configurations, ping telemetry, and traceroute logs using deterministic pattern rules for reliable, reproducible diagnoses."
      },
      {
        title: "Grounded AI Explanations",
        detail: "Uses Google Gemini to generate clear, context-specific remediation steps and configuration patches strictly grounded in verified findings."
      },
      {
        title: "Human-in-the-Loop Review",
        detail: "Provides an interactive Streamlit interface allowing administrators to inspect, edit, or reject recommendations before implementation."
      }
    ],
    tech: ["Python", "Streamlit", "Google Gemini API", "Regex Engine", "Pytest"],
    live: "https://netsage-ai-by-vaibhav2176a.streamlit.app/",
    liveLabel: "Live Platform",
    github: "https://github.com/Vaibhav2176/NetSage-AI",
    githubLabel: "Source Code",
    repo: "Vaibhav2176/NetSage-AI",
    statusNote: null,
    floatingPanels: [
      {
        id: "netsage-commit",
        type: "github-commit",
        position: "top-right",
        icon: "git-commit",
        label: "Latest Commit",
        fallbackValue: "34 Deterministic Checks",
        accent: "amber"
      },
      {
        id: "netsage-diagnostic",
        type: "feature",
        position: "bottom-left",
        icon: "terminal",
        label: "Dual Diagnostic",
        value: "Rule Engine + Gemini AI",
        accent: "emerald"
      }
    ]
  },
  {
    id: "nostera",
    title: "Nostera",
    tagline: "Privacy-Focused Emotional Memory Vault",
    category: "Mobile & Security",
    status: "In Active Development",
    statusType: "dev",
    accent: "rose",
    previewImage: "/projects/nostera-preview.png",
    secondaryScreens: [
      "/projects/nostera-capture.png",
      "/projects/nostera-detail.png"
    ],
    playStoreStatus: "Coming Soon on Google Play",
    description: "A cross-platform mobile application designed to capture personal memories, reflect on meaningful life moments, and rediscover past thoughts with strict data privacy.",
    capabilities: [
      {
        title: "Encrypted Personal Vault",
        detail: "Protects journal entries and personal reflections with strict PostgreSQL Row-Level Security to guarantee complete user isolation."
      },
      {
        title: "Time-Delayed Reflections",
        detail: "Surfaces past thoughts and milestone memories at scheduled intervals to encourage meaningful mindfulness and self-reflection."
      },
      {
        title: "Secure Media Storage",
        detail: "Manages personal photo and audio attachments with time-limited access tokens and backend-only AI integration."
      }
    ],
    tech: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"],
    live: null,
    liveLabel: null,
    github: null,
    githubLabel: null,
    repo: null,
    statusNote: "Active Development • Mobile Prototype",
    floatingPanels: [
      {
        id: "nostera-privacy",
        type: "feature",
        position: "top-left",
        icon: "lock",
        label: "Data Sovereignty",
        value: "Strict PostgreSQL RLS",
        accent: "rose"
      },
      {
        id: "nostera-platform",
        type: "feature",
        position: "bottom-right",
        icon: "smartphone",
        label: "Deployment",
        value: "Closed Play Store Beta",
        accent: "rose"
      }
    ]
  },
  {
    id: "homesync",
    title: "HomeSync",
    tagline: "Collaborative Household Management Concept",
    category: "System Architecture",
    status: "Architectural Concept",
    statusType: "concept",
    accent: "blue",
    previewImage: null,
    description: "An architectural concept and prototype designed to streamline shared household coordination, from recurring chore schedules to multi-tenant expense splitting.",
    capabilities: [
      {
        title: "Multi-Tenant Relational Schema",
        detail: "Built with PostgreSQL and Drizzle ORM to maintain strict relational boundaries across distinct household workspaces."
      },
      {
        title: "Shared Chores & Expense Tracking",
        detail: "Coordinates recurring task assignments and calculates transparent, member-specific expense splits."
      },
      {
        title: "Role-Based Membership",
        detail: "Architected to separate household administration, roommate permissions, and temporary guest access."
      }
    ],
    tech: ["React", "TypeScript", "TanStack Query", "Express.js", "PostgreSQL", "Drizzle ORM"],
    live: null,
    liveLabel: null,
    github: null,
    githubLabel: null,
    repo: null,
    statusNote: "Architectural Concept & Prototype",
    floatingPanels: [
      {
        id: "homesync-schema",
        type: "feature",
        position: "top-right",
        icon: "database",
        label: "Relational Boundary",
        value: "PostgreSQL & Drizzle ORM",
        accent: "blue"
      },
      {
        id: "homesync-isolation",
        type: "feature",
        position: "bottom-left",
        icon: "users",
        label: "Tenant Isolation",
        value: "Chore & Expense Split",
        accent: "cyan"
      }
    ]
  }
];

export const secondaryProjects = [
  {
    id: "shopez",
    title: "Shopez",
    tagline: "E-Commerce Web Application",
    description: "A modular e-commerce storefront prototype built with TypeScript and React for responsive catalog browsing and shopping cart state management.",
    tech: ["TypeScript", "React", "Tailwind CSS", "REST API"],
    github: "https://github.com/Vaibhav2176/shopez",
    githubLabel: "Source Code",
    live: "https://vaibhav2176.github.io/shopez/",
    liveLabel: "Live Demo",
    repo: "Vaibhav2176/shopez",
    status: "Staged Prototype",
    accent: "cyan",
    icon: "shopping-bag"
  },
  {
    id: "eduguard-ai",
    title: "EduGuard AI",
    tagline: "Academic Performance Risk Modeling",
    description: "Machine learning research manuscript and prototype utilizing XGBoost, LSTM, and GNN models to forecast student academic risk trajectories.",
    tech: ["Python", "XGBoost", "LSTM", "GNN", "PyTorch"],
    github: null, // Configurable: Awaiting user repository URL
    githubLabel: "Source Code",
    live: null,   // Configurable: Awaiting user live demo URL
    liveLabel: "Live Demo",
    paperUrl: "/AI Based Student Performance Prediction and Early Warning System (Short).pdf",
    paperLabel: "Research Paper (PDF)",
    repo: null,
    status: "Research Manuscript",
    accent: "blue",
    icon: "file-text"
  },
  {
    id: "demo-clinic",
    title: "Demo Clinic",
    tagline: "Healthcare Appointment Prototype",
    description: "A clinical patient appointment scheduling and electronic medical record management interface prototype with modular UI components.",
    tech: ["JavaScript", "React", "Tailwind CSS", "Component Design"],
    github: "https://github.com/Vaibhav2176/Demo-Clinic",
    githubLabel: "Source Code",
    live: "https://vaibhav2176.github.io/Demo-Clinic/",
    liveLabel: "Live Demo",
    repo: "Vaibhav2176/Demo-Clinic",
    status: "Frontend Prototype",
    accent: "emerald",
    icon: "activity"
  },
  {
    id: "lnct-website",
    title: "LNCT Website",
    tagline: "Campus Event & Competition Portal",
    description: "An institutional web platform prototype designed for college academic symposiums, technical event schedules, and participant registrations at LNCTS Bhopal.",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Web"],
    github: "https://github.com/Vaibhav2176/LNCT-Website",
    githubLabel: "Source Code",
    live: "https://vaibhav2176.github.io/LNCT-Website/",
    liveLabel: "Live Demo",
    repo: "Vaibhav2176/LNCT-Website",
    status: "Competition Project",
    accent: "amber",
    icon: "layers"
  }
];

export const featuredProjects = projectsData.slice(0, 3);
export const supportingProjects = projectsData.slice(3, 5);

export const skillsData = [
  {
    category: "Languages",
    skills: ["C++", "Java", "Python", "JavaScript (ES6+)", "TypeScript", "SQL", "HTML5", "CSS3"]
  },
  {
    category: "Frontend Development",
    skills: ["React", "Vite", "Tailwind CSS", "Responsive Design", "Component Architecture", "State Management"]
  },
  {
    category: "Backend & Systems",
    skills: ["Node.js", "Express.js", "RESTful APIs", "FastAPI Fundamentals", "Authentication & Middleware"]
  },
  {
    category: "Databases & Cloud",
    skills: ["PostgreSQL", "Supabase", "MongoDB", "Mongoose", "Row-Level Security (RLS)", "Vercel"]
  },
  {
    category: "Applied AI & Tooling",
    skills: ["Google Gemini API", "Streamlit", "Regex Diagnostic Engines", "Git & GitHub", "Vitest", "Pytest"]
  },
  {
    category: "Core Computer Science",
    skills: ["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "DBMS", "Operating Systems", "Debugging"]
  }
];

export const educationData = [
  {
    institution: "Lakshmi Narain College of Technology & Science (LNCTS), Bhopal",
    degree: "B.Tech — Computer Science & Engineering",
    period: "2024 — 2028",
    status: "Currently Enrolled (2nd Year)",
    score: "8.25 CGPA (Current)",
    details: "Strong academic focus on core computer science: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and Software Engineering.",
    semesters: [
      { sem: "Semester 1", sgpa: "8.05", cgpa: "8.05", status: "Completed" },
      { sem: "Semester 2", sgpa: "8.25", cgpa: "8.15", status: "Completed" },
      { sem: "Semester 3", sgpa: "8.42", cgpa: "8.25", status: "Completed" },
      { sem: "Semester 4", sgpa: "—", cgpa: "—", status: "Result Pending" }
    ]
  },
  {
    institution: "Mithi Gobindram Public School, Bhopal",
    degree: "Class XII (Senior Secondary — PCM)",
    period: "2024",
    status: "CBSE Board",
    score: "92% Aggregate",
    details: "Majored in Physics, Chemistry, and Mathematics, building strong quantitative analysis and logical problem-solving fundamentals."
  },
  {
    institution: "Mithi Gobindram Public School, Bhopal",
    degree: "Class X (Secondary Education)",
    period: "2022",
    status: "CBSE Board",
    score: "87.7% Aggregate",
    details: "Distinction across Mathematics, Science, and Social Studies."
  }
];

export const certifications = [
  {
    title: "Programming in Java",
    issuer: "NPTEL",
    score: "92% (Elite + Gold Medal)",
    category: "Core Engineering"
  },
  {
    title: "Data Structures & Algorithms Design",
    issuer: "NPTEL",
    score: "Consolidated Score: 52%",
    category: "Core Engineering"
  },
  {
    title: "Introduction to Modern AI",
    issuer: "Cisco Networking Academy",
    score: "Completed",
    category: "AI & Networking"
  },
  {
    title: "Apply AI: Analyze Customer Reviews",
    issuer: "Cisco Networking Academy",
    score: "Completed",
    category: "AI & Networking"
  },
  {
    title: "Data Analytics Essentials",
    issuer: "Cisco Networking Academy",
    score: "Completed",
    category: "Data & Systems"
  },
  {
    title: "AI Assisted Application Development (Vibe Coding)",
    issuer: "NASSCOM",
    score: "100% (Gold)",
    category: "AI & Development"
  },
  {
    title: "Prompt Engineering and ChatGPT",
    issuer: "NASSCOM",
    score: "85% (Gold)",
    category: "AI & Development"
  },
  {
    title: "AI Fundamentals (ASCEND)",
    issuer: "Accenture",
    score: "Completed",
    category: "Enterprise Tech"
  },
  {
    title: "IoT & Digital Transformation",
    issuer: "FutureSkills Prime",
    score: "Silver Recognition",
    category: "IoT & Cloud"
  },
  {
    title: "Creator Studio Fundamentals (Zurich)",
    issuer: "ServiceNow",
    score: "Completed",
    category: "Cloud Platforms"
  }
];

export const leadershipAndAchievements = [
  {
    title: "IEEE Student Branch Secretary",
    organization: "IEEE LNCTS Student Branch",
    period: "Current",
    description: "Serving as Secretary for the college IEEE Student Branch, organizing technical workshops, coding symposiums, and student engineering hackathons. IEEE Student Member valid through December 2026."
  },
  {
    title: "Overall First Prize & Double Gold Medals — RGPV Nodal Arts & Drama",
    organization: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
    period: "2025",
    description: "Awarded Overall First Prize at the 2025 RGPV Nodal Level Competition, securing individual Gold Medals in One Act Play and Mime for outstanding performance and theatrical direction."
  },
  {
    title: "EPAM Technical Selection — Round 2 Qualifier",
    organization: "EPAM Systems",
    period: "2025",
    description: "Successfully cleared rigorous initial algorithmic evaluation and coding rounds to qualify for Round 2 of EPAM's engineering selection process."
  }
];

export const researchPapers = [
  {
    title: "EduGuard AI — Student Performance Prediction & Early Warning System",
    type: "Research Manuscript",
    status: "Completed Research Project",
    technologies: ["XGBoost", "LSTM", "Graph Neural Networks (GNN)", "Synthetic Modeling"],
    description: "Investigated predictive machine learning architectures to forecast academic risk trajectories and enable proactive institutional intervention before course failure.",
    pdfUrl: "/AI Based Student Performance Prediction and Early Warning System (Short).pdf"
  },
  {
    title: "Proactive Cyber Threat Prevention Using Ethical Hacking: A Six-Phase Integration Model",
    type: "Research Manuscript",
    status: "Completed Manuscript",
    technologies: ["Ethical Hacking", "Threat Modeling", "Vulnerability Assessment", "Cybersecurity"],
    description: "Formulated a structured six-phase proactive penetration testing and preventative hardening framework for enterprise perimeter security.",
    pdfUrl: "/Ethical Hacking and Cybersecurity.docx"
  }
];

export const developerActivity = {
  github: {
    username: "Vaibhav2176",
    profileUrl: "https://github.com/Vaibhav2176",
    snapshotDate: "October 2026",
    stats: {
      publicRepos: 6,
      totalContributions: 224,
      totalCommits: 291,
      activeDays: 32,
      followers: 0,
      following: 0,
      accountCreated: "2025",
      primaryLanguage: "TypeScript",
      contributionNote: "224 contributions in the last year • 291 verified commits across 6 public repositories"
    },
    calendar: {
      totalContributions: 224,
      totalCommits: 291,
      activeDays: 32,
      period: "October 2025 – October 2026",
      activeCells: {
        "2026-01-22": { count: 1, level: 1 },
        "2026-02-21": { count: 6, level: 1 },
        "2026-02-22": { count: 3, level: 1 },
        "2026-02-27": { count: 2, level: 1 },
        "2026-02-28": { count: 11, level: 2 },
        "2026-03-02": { count: 11, level: 2 },
        "2026-03-03": { count: 5, level: 1 },
        "2026-03-04": { count: 10, level: 2 },
        "2026-03-08": { count: 20, level: 4 },
        "2026-03-28": { count: 1, level: 1 },
        "2026-03-29": { count: 14, level: 3 },
        "2026-04-01": { count: 2, level: 1 },
        "2026-04-06": { count: 2, level: 1 },
        "2026-04-07": { count: 5, level: 1 },
        "2026-04-08": { count: 4, level: 1 },
        "2026-04-09": { count: 1, level: 1 },
        "2026-04-10": { count: 1, level: 1 },
        "2026-04-12": { count: 4, level: 1 },
        "2026-05-08": { count: 13, level: 3 },
        "2026-05-10": { count: 25, level: 4 },
        "2026-05-14": { count: 16, level: 3 },
        "2026-05-16": { count: 8, level: 2 },
        "2026-05-17": { count: 15, level: 3 },
        "2026-05-18": { count: 4, level: 1 },
        "2026-07-04": { count: 11, level: 2 },
        "2026-07-05": { count: 3, level: 1 },
        "2026-07-10": { count: 4, level: 1 },
        "2026-08-20": { count: 4, level: 1 },
        "2026-08-23": { count: 5, level: 1 },
        "2026-08-25": { count: 6, level: 1 },
        "2026-08-26": { count: 6, level: 1 },
        "2026-10-22": { count: 1, level: 1 }
      }
    },
    topRepositories: [
      {
        name: "rays-academy-renaissance",
        description: "Commercial coaching platform featuring Supabase Row-Level Security, 15-minute signed downloads, and idempotent Razorpay webhook fulfillment.",
        language: "TypeScript",
        languageColor: "#3178c6",
        stars: 0,
        forks: 0,
        commits: 217,
        updatedDate: "October 2026",
        url: "https://github.com/Vaibhav2176/rays-academy-renaissance",
        isFlagship: true
      },
      {
        name: "NetSage-AI",
        description: "AI-assisted network troubleshooting and configuration diagnostic assistant pairing 34 deterministic regex rules with Gemini explanations.",
        language: "Python",
        languageColor: "#3572A5",
        stars: 0,
        forks: 0,
        commits: 10,
        updatedDate: "August 2026",
        url: "https://github.com/Vaibhav2176/NetSage-AI",
        isFlagship: true
      },
      {
        name: "Demo-Clinic",
        description: "Clinical patient appointment and medical record management prototype with modular UI components and responsive layout.",
        language: "JavaScript",
        languageColor: "#f1e05a",
        stars: 0,
        forks: 0,
        commits: 8,
        updatedDate: "March 2026",
        url: "https://github.com/Vaibhav2176/Demo-Clinic",
        isFlagship: false
      }
    ]
  },
  leetcode: {
    username: "OerRUe2yaA",
    profileUrl: "https://leetcode.com/u/OerRUe2yaA/",
    snapshotDate: "October 2026",
    ranking: 1177654,
    totalSolved: 151,
    totalSubmissions: 229,
    acceptanceRate: "65.9%",
    breakdown: {
      easy: { solved: 86, submissions: 136, rate: "63.2%" },
      medium: { solved: 59, submissions: 87, rate: "67.8%" },
      hard: { solved: 6, submissions: 6, rate: "100.0%" }
    },
    primaryLanguage: {
      name: "C++",
      problemsSolved: 149,
      percentage: "98.7%"
    },
    calendar: {
      activeYears: [2025, 2026],
      streak: 34,
      totalActiveDays: 58,
      totalSubmissions: 297,
      submissionCalendar: {
        "1777334400": 1,
        "1783814400": 5,
        "1784678400": 10,
        "1784764800": 3,
        "1784851200": 8,
        "1784937600": 2,
        "1785024000": 3,
        "1785110400": 2,
        "1785196800": 5,
        "1785283200": 1,
        "1785369600": 1,
        "1785456000": 1,
        "1785542400": 1,
        "1785628800": 1,
        "1785974400": 2,
        "1786060800": 4,
        "1788998400": 5,
        "1789084800": 1,
        "1789171200": 5,
        "1789257600": 1,
        "1789344000": 4,
        "1789430400": 5,
        "1789516800": 6,
        "1789603200": 7,
        "1789689600": 8,
        "1789776000": 15,
        "1789862400": 11,
        "1789948800": 3,
        "1790035200": 9,
        "1790121600": 3,
        "1790208000": 4,
        "1790294400": 6,
        "1790380800": 10,
        "1790467200": 13,
        "1790553600": 3,
        "1790640000": 1,
        "1790726400": 1,
        "1790812800": 18,
        "1790899200": 3,
        "1790985600": 21,
        "1791072000": 13,
        "1791158400": 2,
        "1791244800": 5,
        "1791331200": 2,
        "1791417600": 3,
        "1791504000": 8,
        "1791590400": 4,
        "1791676800": 2,
        "1791763200": 1,
        "1791849600": 2,
        "1792022400": 3,
        "1792368000": 1,
        "1792454400": 5,
        "1792540800": 5,
        "1792627200": 10,
        "1792713600": 6,
        "1792800000": 10,
        "1792886400": 2
      }
    },
    topicStrengths: [
      { name: "Array", solved: 91, category: "Fundamental" },
      { name: "Hash Table", solved: 42, category: "Intermediate" },
      { name: "Math", solved: 34, category: "Intermediate" },
      { name: "String", solved: 34, category: "Fundamental" },
      { name: "Two Pointers", solved: 29, category: "Fundamental" },
      { name: "Binary Search", solved: 28, category: "Intermediate" },
      { name: "Sliding Window", solved: 21, category: "Intermediate" },
      { name: "Sorting", solved: 21, category: "Fundamental" },
      { name: "Dynamic Programming", solved: 6, category: "Advanced" },
      { name: "Greedy", solved: 6, category: "Intermediate" }
    ],
    summaryNote: "Algorithmic practice emphasizes rigorous time and space complexity optimization, tackling pointer manipulation, binary search bounds, sliding windows, and amortized data structures primarily implemented in C++."
  }
};

