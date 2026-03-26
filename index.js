const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/get-questions', async (req, res) => {
    const topic = req.query.topic || "Biotechnology";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Behtar prompt taaki AI sirf JSON hi de
        const prompt = `Generate 10 MCQ style questions on ${topic} for CSIR NET. Return ONLY a plain JSON array of strings. Do not include markdown or backticks.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        
        // Clean JSON backticks if AI adds them
        text = text.replace(/```json|```/g, "").trim();
        
        const questions = JSON.parse(text);
        res.json(questions);
    } catch (error) {
        console.error("DEBUG ERROR:", error.message);
        // Isse aapko pata chalega ki asli dikkat API key ki hai ya kuch aur
        res.status(500).json([`Error Details: ${error.message}`]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server LIVE!`));
