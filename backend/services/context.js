import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Корень проекта находится на два уровня выше папки backend/services
const projectRoot = path.resolve(__dirname, "..", "..");

let cachedContext = null;

/**
 * Читает файлы контекста клиники и кэширует их содержимое.
 * @returns {{ clinicInfo: string, faq: string, rules: string }}
 */
export function getContext() {
  if (cachedContext) {
    return cachedContext;
  }

  try {
    const clinicInfoPath = path.join(projectRoot, "clinic-info.txt");
    const faqPath = path.join(projectRoot, "faq-client.txt");
    const rulesPath = path.join(projectRoot, "rules.txt");

    console.log(`Загрузка контекста из файлов:\n - ${clinicInfoPath}\n - ${faqPath}\n - ${rulesPath}`);

    const clinicInfo = fs.readFileSync(clinicInfoPath, "utf8");
    const faq = fs.readFileSync(faqPath, "utf8");
    const rules = fs.readFileSync(rulesPath, "utf8");

    cachedContext = { clinicInfo, faq, rules };
    return cachedContext;
  } catch (error) {
    console.error("Ошибка при чтении файлов контекста клиники:", error);
    throw new Error("Не удалось загрузить данные о клинике с сервера.");
  }
}
