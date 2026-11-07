const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.'));
app.post('/api/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt || '';
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Serveur GENIUS en ligne sur ' + PORT));￼Enter
