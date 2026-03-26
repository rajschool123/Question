const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API Key Render ke Environment Variables se aayegi
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/get-questions', async (req, res) => {
    const topic = req.query.topic || "Biotechnology";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate 10 professional study questions for ${topic} for CSIR NET Life Science. 
                        Return ONLY a JSON array of strings. 
                        Example format: ["Question 1", "Question 2"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        
        res.json(JSON.parse(text));
    } catch (error) {
        console.error(error);
        res.status(500).json(["AI is busy. Please try again in 10 seconds."]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running!`));
