const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.send(`
        <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GENIUS AI</title>
        <style>body{font-family:sans-serif;background:#111;color:#fff;padding:20px}input,button{padding:12px;border-radius:10px;border:none;width:100%;margin-top:10px}button{background:#7c3aed;color:#fff;font-weight:bold}#rep{background:#222;padding:15px;border-radius:10px;margin-top:15px;white-space:pre-wrap}</style></head>
        <body><h1>GENIUS AI ✨</h1><p>Pose ta question :</p>
        <input id="q" placeholder="Écris ici..."><button onclick="go()">Envoyer</button><div id="rep">Ta réponse va apparaître ici...</div>
        <script>
        async function go(){
          const q=document.getElementById('q').value;
          document.getElementById('rep').innerText='Chargement...';
          const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:q})});
          const d=await r.json();
          document.getElementById('rep').innerText=d.reply || d.error || 'Erreur serveur';
        }
        </script></body></html>
      `);
    }
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt || 'Bonjour';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Serveur sur port ' + PORT));
