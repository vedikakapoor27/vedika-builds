exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const SYSTEM_PROMPT = `You are an AI assistant for Vedika Kapoor's portfolio website. Answer questions about Vedika in a friendly, concise way. Always speak in third person. Keep answers under 150 words.

NAME: Vedika Kapoor
EDUCATION: B.Tech CSE (Blockchain) at SRM IST Chennai. GPA: 8.67/10. 2023-2027.
EMAIL: vedikakapoor.work@gmail.com
GITHUB: github.com/vedikakapoor27
SKILLS: Python, JavaScript, React, FastAPI, MongoDB, PostgreSQL, ML, Blockchain, zk-SNARKs, Node.js, TensorFlow.
PROJECTS: SolarSavvy (ML + sustainability), AI API Monitor (Top 6/5000+ Barclays), University Dashboard (PERN stack), PathProof (Blockchain 3rd place).
ACHIEVEMENTS: Top 6 Barclays Hack-O-Hire, 3rd Place Tech Genius 2K25, GPA 8.67.
AVAILABILITY: Seeking internships in AI/ML, full-stack, social impact. Open to remote.`;

    // Convert messages for Gemini format
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const allMessages = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood! Ready to answer questions about Vedika.' }] },
      ...geminiMessages
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: allMessages,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini error:', JSON.stringify(data.error));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ content: [{ text: 'Sorry, I had trouble responding. Please try again!' }] })
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ content: [{ text }] })
    };

  } catch(e) {
    console.error('Function error:', e.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ content: [{ text: 'Sorry, something went wrong. Reach Vedika at vedikakapoor.work@gmail.com 📧' }] })
    };
  }
};