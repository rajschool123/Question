import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate", async (req, res) => {
  try {
    const { exam, topic } = req.body;

    const prompt = `Generate 10 MCQs for ${exam} on ${topic}.
    Give options A B C D and correct answer.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    res.json({
      text: data.candidates[0].content.parts[0].text
    });

  } catch {
    res.status(500).json({ error: "Error" });
  }
});

app.listen(3000);
