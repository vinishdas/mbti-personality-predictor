const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/predict', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No input text provided' });
  }

  const pythonProcess = spawn('python3', ['./models/model_api.py', text]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    try {
      const result = JSON.parse(output);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      res.json({ mbti_type: result.mbti_type });
    } catch (err) {
      res.status(500).json({ error: 'Error parsing model response' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
