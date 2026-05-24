import { getContext } from "./context.js";

/**
 * Отправляет запрос к модели Ollama, используя контекст клиники.
 * @param {string} userMessage Сообщение пользователя
 * @returns {Promise<string>} Ответ от AI
 */
async function askOllama(userMessage) {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
  const ollamaModel = process.env.OLLAMA_MODEL || "granite4.1:3b";

  try {
    const { clinicInfo, faq, rules } = getContext();

    const prompt = `
Ты профессиональный AI-помощник стоматологической клиники "Доктор Гудман".
Твоя цель — отвечать клиентам вежливо, точно и только на основе предоставленной информации о клинике.

Правила общения:
${rules}

Информация о клинике:
${clinicInfo}

Часто задаваемые вопросы (FAQ):
${faq}

Вопрос клиента:
${userMessage}
`;

    console.log(`Отправка запроса к Ollama (${ollamaModel}) по адресу: ${ollamaUrl}`);

    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка Ollama API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ошибка при обращении к Ollama:", error);
    throw new Error("Не удалось получить ответ от AI. Пожалуйста, убедитесь, что Ollama запущена.");
  }
}

export default askOllama;