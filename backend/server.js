import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";

// Загрузка настроек из файла .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Тестовый роут
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Подключение API чат-бота
app.use("/chat", chatRouter);

// Статика для фронтенда (чтобы можно было открывать сайт по localhost:3000)
const frontendPath = path.resolve(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// saitik.html в качестве главной страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "saitik.html"));
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  СЕРВЕР СТОМАТОЛОГИИ УСПЕШНО ЗАПУЩЕН!`);
  console.log(`  Сайт клиники: http://localhost:${PORT}`);
  console.log(`  API чата:     http://localhost:${PORT}/chat`);
  console.log(`=================================================`);
});