import fs from 'fs';
import path from 'path';
import http from 'http';

const requiredPdfs = [
  {
    id: 'PDF-RESUME',
    label: 'Main Resume (PDF)',
    webUrl: '/Vaibhav_Amulani_Resume_2_page.pdf',
    diskPath: fs.existsSync('public') ? 'public/Vaibhav_Amulani_Resume_2_page.pdf' : 'Portfolio/public/Vaibhav_Amulani_Resume_2_page.pdf',
    downloadName: 'Vaibhav_Amulani_Resume.pdf',
    referencedIn: ['Contact.jsx', 'Hero.jsx', 'Navbar.jsx', 'portfolioData.js']
  },
  {
    id: 'PDF-CERT-NPTEL-JAVA',
    label: 'Programming in Java (NPTEL)',
    webUrl: '/certificates/NPTEL_Programming_in_Java_Elite_Gold.pdf',
    diskPath: 'Portfolio/public/certificates/NPTEL_Programming_in_Java_Elite_Gold.pdf',
    downloadName: 'NPTEL_Programming_in_Java_Elite_Gold.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-NPTEL-DSA',
    label: 'Data Structures & Algorithms Design (NPTEL)',
    webUrl: '/certificates/NPTEL_Data_Structures_and_Algorithms_Design.pdf',
    diskPath: 'Portfolio/public/certificates/NPTEL_Data_Structures_and_Algorithms_Design.pdf',
    downloadName: 'NPTEL_Data_Structures_and_Algorithms_Design.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-CISCO-INTERN',
    label: 'Cisco AICTE Virtual Internship Program 2026',
    webUrl: '/certificates/Cisco_AICTE_Virtual_Internship_Program_2026.pdf',
    diskPath: 'Portfolio/public/certificates/Cisco_AICTE_Virtual_Internship_Program_2026.pdf',
    downloadName: 'Cisco_AICTE_Virtual_Internship_Program_2026.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-CISCO-AI',
    label: 'Introduction to Modern AI (Cisco)',
    webUrl: '/certificates/Cisco_Intro_to_Modern_AI.pdf',
    diskPath: 'Portfolio/public/certificates/Cisco_Intro_to_Modern_AI.pdf',
    downloadName: 'Cisco_Intro_to_Modern_AI.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-CISCO-REVIEWS',
    label: 'Apply AI: Analyze Customer Reviews (Cisco)',
    webUrl: '/certificates/Cisco_Apply_AI_Analyze_Customer_Reviews.pdf',
    diskPath: 'Portfolio/public/certificates/Cisco_Apply_AI_Analyze_Customer_Reviews.pdf',
    downloadName: 'Cisco_Apply_AI_Analyze_Customer_Reviews.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-CISCO-ANALYTICS',
    label: 'Data Analytics Essentials (Cisco)',
    webUrl: '/certificates/Cisco_Data_Analytics_Essentials.pdf',
    diskPath: 'Portfolio/public/certificates/Cisco_Data_Analytics_Essentials.pdf',
    downloadName: 'Cisco_Data_Analytics_Essentials.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-CISCO-IOT',
    label: 'Introduction to IoT and Digital Transformation (Cisco)',
    webUrl: '/certificates/Cisco_IoT_Course_Certificate.pdf',
    diskPath: 'Portfolio/public/certificates/Cisco_IoT_Course_Certificate.pdf',
    downloadName: 'Cisco_IoT_Course_Certificate.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-NASSCOM-VIBE',
    label: 'AI Assisted Application Development (Vibe Coding) (NASSCOM)',
    webUrl: '/certificates/NASSCOM_Vibe_Coding.pdf',
    diskPath: 'Portfolio/public/certificates/NASSCOM_Vibe_Coding.pdf',
    downloadName: 'NASSCOM_Vibe_Coding.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-NASSCOM-PROMPT',
    label: 'Prompt Engineering and ChatGPT (NASSCOM)',
    webUrl: '/certificates/NASSCOM_Prompt_Engineering.pdf',
    diskPath: 'Portfolio/public/certificates/NASSCOM_Prompt_Engineering.pdf',
    downloadName: 'NASSCOM_Prompt_Engineering.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-EXPERIENTIAL',
    label: 'Experiential Learning (FutureSkills Prime / NASSCOM)',
    webUrl: '/certificates/Experiential_Learning.pdf',
    diskPath: 'Portfolio/public/certificates/Experiential_Learning.pdf',
    downloadName: 'Experiential_Learning.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-IEEE',
    label: 'IEEE Student Membership Certificate',
    webUrl: '/certificates/IEEE_Membership_Certificate.pdf',
    diskPath: 'Portfolio/public/certificates/IEEE_Membership_Certificate.pdf',
    downloadName: 'IEEE_Membership_Certificate.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-ACCENTURE-ASCEND',
    label: 'AI Fundamentals (ASCEND) (Accenture)',
    webUrl: '/certificates/Accenture_AI_Fundamentals_ASCEND.pdf',
    diskPath: 'Portfolio/public/certificates/Accenture_AI_Fundamentals_ASCEND.pdf',
    downloadName: 'Accenture_AI_Fundamentals_ASCEND.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-CERT-FUTURESKILLS-IOT',
    label: 'IoT & Digital Transformation (FutureSkills Prime)',
    webUrl: '/certificates/FutureSkills_Prime_IoT_Digital_Transformation.pdf',
    diskPath: 'Portfolio/public/certificates/FutureSkills_Prime_IoT_Digital_Transformation.pdf',
    downloadName: 'FutureSkills_Prime_IoT_Digital_Transformation.pdf',
    referencedIn: ['Academic.jsx']
  },
  {
    id: 'PDF-PAPER-EDUGUARD',
    label: 'EduGuard AI Research Manuscript',
    webUrl: '/AI%20Based%20Student%20Performance%20Prediction%20and%20Early%20Warning%20System%20(Short).pdf',
    diskPath: 'Portfolio/public/AI Based Student Performance Prediction and Early Warning System (Short).pdf',
    downloadName: 'AI Based Student Performance Prediction and Early Warning System (Short).pdf',
    referencedIn: ['Academic.jsx', 'portfolioData.js']
  },
  {
    id: 'DOC-PAPER-CYBER',
    label: 'Ethical Hacking and Cybersecurity Manuscript',
    webUrl: '/Ethical%20Hacking%20and%20Cybersecurity.docx',
    diskPath: 'Portfolio/public/Ethical Hacking and Cybersecurity.docx',
    downloadName: 'Ethical Hacking and Cybersecurity.docx',
    referencedIn: ['Academic.jsx']
  }
];

function checkHttp(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5173${urlPath}`, (res) => {
      let size = 0;
      let firstChunk = null;
      res.on('data', (chunk) => {
        if (!firstChunk) firstChunk = chunk;
        size += chunk.length;
      });
      res.on('end', () => {
        const isPdf = firstChunk ? firstChunk.toString('utf8', 0, 5) === '%PDF-' : false;
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          size,
          isPdf,
          ok: res.statusCode === 200
        });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 'ERR', error: err.message, ok: false });
    });
  });
}

async function run() {
  console.log('Verifying PDFs and downloadable assets...');
  const results = [];

  for (const item of requiredPdfs) {
    const actualDiskPath = fs.existsSync(item.diskPath) ? item.diskPath : item.diskPath.replace(/^Portfolio\//, '');
    const exists = fs.existsSync(actualDiskPath);
    let fileSize = 0;
    let headerPdf = false;

    if (exists) {
      const stat = fs.statSync(actualDiskPath);
      fileSize = stat.size;
      const fd = fs.openSync(actualDiskPath, 'r');
      const buf = Buffer.alloc(8);
      fs.readSync(fd, buf, 0, 8, 0);
      fs.closeSync(fd);
      headerPdf = buf.toString('utf8', 0, 5) === '%PDF-';
    }

    const httpRes = await checkHttp(item.webUrl);

    const record = {
      ...item,
      existsOnDisk: exists,
      diskSizeBytes: fileSize,
      diskHeaderValid: headerPdf,
      httpStatus: httpRes.statusCode,
      httpContentType: httpRes.contentType,
      httpSizeBytes: httpRes.size,
      httpIsPdf: httpRes.isPdf,
      pass: exists && (item.diskPath.endsWith('.docx') || headerPdf) && httpRes.ok
    };
    results.push(record);
    console.log(`${record.pass ? 'PASS' : 'FAIL'} [${record.id}] ${record.label} -> Disk: ${exists} (${fileSize}b), HTTP: ${httpRes.statusCode} (${httpRes.size}b)`);
  }

  fs.writeFileSync('pdf_verification_results.json', JSON.stringify(results, null, 2));
}

run();
