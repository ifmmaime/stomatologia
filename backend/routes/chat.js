import express from "express";
import askOllama from "../services/ollama.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({
        reply: "Пожалуйста, введите корректное сообщение."
      });
    }

    console.log("Получен вопрос от клиента:", userMessage);
    const reply = await askOllama(userMessage.trim());

    res.json({ reply });
  } catch (err) {
    console.error("Ошибка в роуте /chat:", err);
    res.status(500).json({
      reply: err.message || "Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже."
    });
  }
});

export default router;