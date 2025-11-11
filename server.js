require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3002; // Changed default port to 3002

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { concept, field } = req.body;
    
    if (!concept || !field) {
      return res.status(400).json({ error: 'Concept and field are required' });
    }

    const prompt = `Hãy tạo một ví dụ thực tế ngắn gọn (khoảng 2-3 câu) về "${concept}" trong lĩnh vực "${field}". 
    Ví dụ nên cụ thể, dễ hiểu và phản ánh rõ nét mối liên hệ giữa lý thuyết và thực tiễn.
    Yêu cầu: Viết bằng tiếng Việt, ngắn gọn, súc tích.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while generating content' });
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please check for other running servers.`);
    console.log('Trying to find an available port...');
    // Try to find an available port
    const newPort = parseInt(port) + 1;
    const newServer = app.listen(newPort, '0.0.0.0', () => {
      console.log(`Server is now running on http://localhost:${newPort}`);
    });
    
    newServer.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});
