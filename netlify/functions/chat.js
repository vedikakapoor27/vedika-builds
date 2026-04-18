const https = require('https');

exports.handler = async function(event) {

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const SYSTEM_PROMPT = `You are an AI assistant for Vedika Kapoor's portfolio website. You answer questions about Vedika in a friendly, concise, and professional way. Always speak about Vedika in third person. Keep answers under 150 words unless asked for detail.

Here is everything you know about Vedika:

NAME: Vedika Kapoor
EDUCATION: B.Tech Computer Science (Blockchain Technology) at SRM Institute of Science and Technology, Chennai. GPA: 8.67/10. Jul 2023 – May 2027.
LOCATION: Chennai, Tamil Nadu, India. Open to remote opportunities worldwide.
EMAIL: vedikakapoor.work@gmail.com
LINKEDIN: linkedin.com/in/vedika-kapoor-4a635a289
GITHUB: github.com/vedikakapoor27

SKILLS: Python, JavaScript, Java, C, C++, SQL, React.js, Node.js, Express, FastAPI, TensorFlow, Streamlit, Tailwind CSS, MongoDB, PostgreSQL, Elasticsearch, Kibana, Git, GitHub, Machine Learning, ChatGPT (structured use), Canva AI, Blockchain, zk-SNARKs, IPFS, Solidity.

PROJECTS:
1. SolarSavvy - ML platform improving solar energy accessibility for low-income Indian homeowners. ±12% error margin across 5 Indian states. Stack: Python, ML, Streamlit.
2. AI API Monitor - Real-time anomaly detection using Isolation Forest + Prophet forecasting. Top 6 / 5000+ at Barclays Hack-O-Hire. Stack: FastAPI, MongoDB, Elasticsearch, React.
3. University Dashboard - Full-stack PERN classroom management. JWT auth, RBAC, 12 REST endpoints. Deploying April 2026.
4. PathProof - Blockchain + zk-SNARK supply chain traceability. Won 3rd place Tech Genius 2K25.

EXPERIENCE:
1. Secretary, Computer Society of India (Aug 2025 - Present): Led 200+ participant hackathon, increased engagement 40%.
2. Social Media Intern, Pledge a Smile Foundation (Jul-Aug 2024): Grew follower base 18% in 6 weeks.

ACHIEVEMENTS:
- Top 6 Finalist, Barclays Hack-O-Hire (Apr 2025) from 5000+ applicants
- 3rd Runner Up, Tech Genius 2K25 (Sep 2025)
- GPA 8.67/10

AVAILABILITY: Actively seeking internships in tech + social impact, AI/ML, full-stack. Open to remote international roles.`;

    const requestData = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    const response = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(requestData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.write(requestData);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: response.body
    };

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};