import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 5000;
const storage = multer.memoryStorage();
//const
const upload = multer({
  storage,
});

dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("backend running");
});

app.post("/chat", (req, res) => {
  const msg = req.body.message;
  res.json({
    reply: msg,
  });
});

app.post("/analyze-resume", upload.array("files"), async (req, res) => {
  const files = req.files;
  const prompt = req.body.prompt;
  let allDocs = [];
  if (!files.length) {
    res.json({
      reply: "Please send a file",
    });
  }
  try {
    for (const file of files) {
      const uint8 = new Uint8Array(file.buffer);
      const parse = new PDFParse(uint8);

      const result = await parse.getText();
      allDocs.push({
        name: file.originalname,
        text: result.text
      });
    }

    let finalDoc = allDocs
      .map(
        (doc) =>
          `${doc.name}\n
        ${doc.text}`,
      )
      .join("\n\n------------------\n\n");
    finalDoc = "files text: \n" + finalDoc + "\n" + "Question: \n" + prompt;
      const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "user",
              content: finalDoc,
            },
          ],
        }),
      },
    );

    const data = await response.json()


    res.json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    res.json({
      reply: err.message,
    });
  }
});

app.post("/ai-chat", async (req, res) => {
  try {
    //gemini integration
    //     const ai = new GoogleGenAI({
    //     apiKey: process.env.GEMINI_API_KEY
    // })
    // const msg = req.body.message
    // const response = await ai.models.generateContent({
    //     model:"gemini-2.5-flash",
    //     contents:msg
    // })

    // res.send(response.text)

    //OpenRouter integration
    const msg = req.body.message;
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "user",
              content: msg,
            },
          ],
        }),
      },
    );

    const data = await response.json()

    res.json({
        reply:data.choices[0].message.content
    })
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Backend running in http://localhost:${PORT}`);
});
