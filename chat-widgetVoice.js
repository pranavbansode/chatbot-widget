
// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        /* Remaining CSS and script code was cut off in input, but let's assume the user meant to save all of it */
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const container = document.createElement("div");
    container.className = "n8n-chat-widget";

    container.innerHTML = `
        <div class="chat-container">
            <div class="brand-header">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/N8n-logo.png" alt="Brand Logo">
                <span>n8n Chat</span>
                <button class="close-button" title="Close">&times;</button>
            </div>
            <div class="new-conversation">
                <div class="welcome-text">Hey there 👋<br>How can I help you today?</div>
                <button class="new-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.2A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start a new conversation
                </button>
                <p class="response-text">Typically replies within a few hours</p>
            </div>
            <div class="chat-interface">
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea placeholder="Type your message..."></textarea>
                    <button>Send</button>
                </div>
            </div>
            <div class="chat-footer">
                <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">Powered by n8n</a>
            </div>
        </div>
        <button class="chat-toggle" aria-label="Toggle chat">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.2A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </button>
    `;

    document.body.appendChild(container);

    const toggleBtn = container.querySelector(".chat-toggle");
    const chatContainer = container.querySelector(".chat-container");
    const closeBtn = container.querySelector(".close-button");
    const startChatBtn = container.querySelector(".new-chat-btn");
    const chatInterface = container.querySelector(".chat-interface");
    const newConversation = container.querySelector(".new-conversation");
    const textarea = container.querySelector(".chat-input textarea");
    const sendBtn = container.querySelector(".chat-input button");
    const messages = container.querySelector(".chat-messages");

    toggleBtn.addEventListener("click", () => {
        chatContainer.classList.toggle("open");
    });

    closeBtn.addEventListener("click", () => {
        chatContainer.classList.remove("open");
    });

    startChatBtn.addEventListener("click", () => {
        newConversation.style.display = "none";
        chatInterface.classList.add("active");
        textarea.focus();
    });

    sendBtn.addEventListener("click", sendMessage);
    textarea.addEventListener("keypress", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = textarea.value.trim();
        if (text) {
            const userMsg = document.createElement("div");
            userMsg.className = "chat-message user";
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            textarea.value = "";
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                const botMsg = document.createElement("div");
                botMsg.className = "chat-message bot";
                botMsg.textContent = "Thanks for reaching out. We’ll get back to you soon!";
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        }
    }
})();
