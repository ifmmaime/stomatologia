// Динамическое подключение шрифта Montserrat для виджета
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// Создание контейнера для виджета
const widgetContainer = document.createElement("div");
widgetContainer.id = "ai-chat-container";

// Inline SVG-иконки для избежания внешних запросов
const chatIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 28px; height: 28px;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`;
const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 20px; height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
const sendIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px; transform: rotate(-45deg) translate(2px, -2px);"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`;
const botAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>`; // Медицинский крест

widgetContainer.innerHTML = `
  <!-- Кнопка вызова чата -->
  <button id="ai-chat-fab" aria-label="Открыть чат">
    <span class="ai-chat-fab-icon">${chatIconSvg}</span>
  </button>

  <!-- Окно чата -->
  <div id="ai-chat-window" class="ai-chat-hidden">
    <!-- Шапка чата -->
    <div id="ai-chat-header">
      <div class="ai-chat-header-info">
        <div class="ai-chat-avatar">
          ${botAvatarSvg}
          <span class="ai-chat-status-dot"></span>
        </div>
        <div>
          <div class="ai-chat-title">Доктор Гудман</div>
          <div class="ai-chat-subtitle">ИИ-консультант онлайн</div>
        </div>
      </div>
      <button id="ai-chat-close" aria-label="Закрыть чат">
        ${closeIconSvg}
      </button>
    </div>

    <!-- Область сообщений -->
    <div id="ai-chat-messages">
      <!-- Приветствие -->
      <div class="ai-message-wrapper ai-message-bot">
        <div class="ai-message-avatar">${botAvatarSvg}</div>
        <div class="ai-message-bubble">
          Здравствуйте! Я виртуальный ассистент стоматологии «Доктор Гудман». 🦷
          Могу рассказать о наших услугах, ценах, специалистах клиники, графике работы или помочь подготовиться к приему. О чем вы хотите узнать?
        </div>
      </div>
    </div>

    <!-- Индикатор печати ИИ -->
    <div id="ai-chat-typing" class="ai-chat-hidden">
      <div class="ai-message-wrapper ai-message-bot">
        <div class="ai-message-avatar">${botAvatarSvg}</div>
        <div class="ai-message-bubble ai-typing-bubble">
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
          <span class="ai-dot"></span>
        </div>
      </div>
    </div>

    <!-- Поле ввода -->
    <div id="ai-chat-input-container">
      <div class="ai-chat-input-wrapper">
        <input
          id="ai-chat-input"
          placeholder="Задайте ваш вопрос..."
          autocomplete="off"
        />
        <button id="ai-chat-send" aria-label="Отправить">
          ${sendIconSvg}
        </button>
      </div>
      <div class="ai-chat-footer-text">
        Ассистент отвечает автоматически.
      </div>
    </div>
  </div>
`;

document.body.appendChild(widgetContainer);

const fab = document.getElementById("ai-chat-fab");
const chatWindow = document.getElementById("ai-chat-window");
const closeBtn = document.getElementById("ai-chat-close");
const messagesList = document.getElementById("ai-chat-messages");
const inputField = document.getElementById("ai-chat-input");
const sendBtn = document.getElementById("ai-chat-send");
const typingIndicator = document.getElementById("ai-chat-typing");

// Определение URL API (подстраивается под текущий хост или падает на localhost:3000)
const API_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "/chat"
  : "http://localhost:3000/chat";

// Открыть/закрыть чат
function toggleChat() {
  if (chatWindow.classList.contains("ai-chat-hidden")) {
    chatWindow.classList.remove("ai-chat-hidden");
    chatWindow.classList.add("ai-chat-visible");
    inputField.focus();
    messagesList.scrollTop = messagesList.scrollHeight;
  } else {
    chatWindow.classList.remove("ai-chat-visible");
    chatWindow.classList.add("ai-chat-hidden");
  }
}

fab.addEventListener("click", toggleChat);
closeBtn.addEventListener("click", toggleChat);

// Добавление сообщения в список
function addMessage(text, isUser = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `ai-message-wrapper ${isUser ? "ai-message-user" : "ai-message-bot"}`;
  
  let avatarHtml = "";
  if (!isUser) {
    avatarHtml = `<div class="ai-message-avatar">${botAvatarSvg}</div>`;
  }
  
  wrapper.innerHTML = `
    ${avatarHtml}
    <div class="ai-message-bubble">
      ${text}
    </div>
  `;
  
  messagesList.appendChild(wrapper);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Управление статусом печати
function setTypingStatus(show) {
  if (show) {
    typingIndicator.classList.remove("ai-chat-hidden");
    messagesList.scrollTop = messagesList.scrollHeight;
  } else {
    typingIndicator.classList.add("ai-chat-hidden");
  }
}

// Отправка сообщения
async function handleSend() {
  const text = inputField.value.trim();
  if (!text) return;

  addMessage(text, true);
  inputField.value = "";
  setTypingStatus(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    setTypingStatus(false);

    if (response.ok) {
      addMessage(data.reply, false);
    } else {
      addMessage(data.reply || "К сожалению, произошла ошибка. Пожалуйста, попробуйте еще раз.", false);
    }
  } catch (err) {
    setTypingStatus(false);
    addMessage("Не удалось связаться с сервером. Пожалуйста, проверьте подключение и убедитесь, что сервер Ollama запущен.", false);
    console.error("Widget Error:", err);
  }
}

sendBtn.addEventListener("click", handleSend);
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});