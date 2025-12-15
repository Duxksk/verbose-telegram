import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔑 직접 하드코딩한 OpenAI API 키
const openai = new OpenAI({
  apiKey: "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"
});

// 죽은 사람 전용 메모리
let memory = "";

// 추억/특징 추가
app.post("/add-memory", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "내용 없음" });

  memory += `\n${text}`;
  res.json({ message: "추억이 저장되었습니다." });
});

// 질문 → AI 답변
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "질문 없음" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `입력된 추억과 특징을 가진 사람처럼 답변합니다.\n추억과 특징:\n${memory}`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.75,
      max_tokens: 500
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 생성 실패" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
