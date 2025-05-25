// Check if the chat widget has already been loaded
if (!window.chatWidgetLoaded) {
  window.chatWidgetLoaded = true;

  // Create chat button
  const chatButton = document.createElement("button");
  chatButton.innerHTML = "Chat with us";
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";
  chatButton.style.zIndex = "9999";
  chatButton.style.padding = "10px 20px";
  chatButton.style.backgroundColor = "#007bff";
  chatButton.style.color = "#fff";
  chatButton.style.border = "none";
  chatButton.style.borderRadius = "5px";
  chatButton.style.cursor = "pointer";
  document.body.appendChild(chatButton);

  // Create chat widget container
  const chatWidget = document.createElement("div");
  chatWidget.classList.add("n8n-chat-widget__container");
  chatWidget.innerHTML = `
    <div class="n8n-chat-widget__header">
      <span>Chatbot</span>
      <button class="n8n-chat-widget__close-button">&times;</button>
    </div>
    <div class="n8n-chat-widget__messages"></div>
    <div class="n8n-chat-widget__input-wrapper">
      <input type="text" class="n8n-chat-widget__input" placeholder="Type your message..." />
      <button class="n8n-chat-widget__send-button">Send</button>
    </div>
  `;
  document.body.appendChild(chatWidget);

  // Toggle chat widget visibility
  chatButton.addEventListener("click", () => {
    chatWidget.classList.toggle("n8n-chat-widget__container--visible");
  });

  // Close chat widget
  chatWidget.querySelector(".n8n-chat-widget__close-button").addEventListener("click", () => {
    chatWidget.classList.remove("n8n-chat-widget__container--visible");
  });

  // Send message
  const sendMessage = () => {
    const input = chatWidget.querySelector(".n8n-chat-widget__input");
    const message = input.value.trim();
    if (message !== "") {
      displayMessage(message, "user");
      input.value = "";
      // Send message to backend (e.g., via fetch or WebSocket)
    }
  };

  chatWidget.querySelector(".n8n-chat-widget__send-button").addEventListener("click", sendMessage);

  chatWidget.querySelector(".n8n-chat-widget__input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Display message in chat
  const displayMessage = (message, sender) => {
    const messagesContainer = chatWidget.querySelector(".n8n-chat-widget__messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("n8n-chat-widget__message", `n8n-chat-widget__message--${sender}`);
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .n8n-chat-widget__container {
      display: none;
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow: hidden;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }
    .n8n-chat-widget__container--visible {
      display: flex;
    }
    .n8n-chat-widget__header {
      background: #007bff;
      color: #fff;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .n8n-chat-widget__close-button {
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }
    .n8n-chat-widget__messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    .n8n-chat-widget__message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      max-width: 80%;
      word-wrap: break-word;
    }
    .n8n-chat-widget__message--user {
      background: #dcf8c6;
      align-self: flex-end;
    }
    .n8n-chat-widget__message--bot {
      background: #f1f0f0;
      align-self: flex-start;
    }
    .n8n-chat-widget__input-wrapper {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
    }
    .n8n-chat-widget__input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .n8n-chat-widget__send-button {
      background: #007bff;
      color: #fff;
      border: none;
      padding: 8px 12px;
      margin-left: 5px;
      border-radius: 4px;
      cursor: pointer;
    }

    /* 🎤 Voice Input Button Styles */
    .n8n-chat-widget__voice-button {
      background-color: #ffffff;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      margin-left: 0.3rem;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: background 0.2s ease;
    }

    .n8n-chat-widget__voice-button:hover {
      background-color: #f0f0f0;
    }
  `;
  document.head.appendChild(style);

  // 🎤 Voice Input Button UI
  const chatInputWrapper = chatWidget.querySelector(".n8n-chat-widget__input-wrapper");

  const voiceInputButton = document.createElement("button");
  voiceInputButton.classList.add("n8n-chat-widget__voice-button");
  voiceInputButton.innerHTML = "🎤";
  voiceInputButton.title = "Voice Input";

  // Add the voice input button next to the send button
  chatInputWrapper.appendChild(voiceInputButton);
}
