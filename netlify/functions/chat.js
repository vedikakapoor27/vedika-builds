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
PROJECTS: SolarSavvy (ML sustainability), AI API Monitor (Top 6/5000+ Barclays), University Dashboard (PERN stack), PathProof (Blockchain 3rd place).
ACHIEVEMENTS: Top 6 Barclays Hack-O-Hire, 3rd Place Tech Genius 2K25, GPA 8.67.
AVAILABILITY: Seeking internships in AI/ML, full-stack, social impact. Open to remote.`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();
    console.log('Groq response status:', response.status);
    console.log('Groq data:', JSON.stringify(data).substring(0, 200));

    if (data.error) {
      console.error('Groq error:', JSON.stringify(data.error));
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          content: [{ text: `Error: ${data.error.message}` }]
        })
      };
    }

    const text = data.choices?.[0]?.message?.content || 'No response received.';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ content: [{ text }] })
    };

  } catch(e) {
    console.error('Function error:', e.message);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        content: [{ text: `Error: ${e.message}` }]
      })
    };
  }
};