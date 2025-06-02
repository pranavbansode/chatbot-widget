// Chat Widget Script with Voice Input - UI Only
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

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-message.voice {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .n8n-chat-widget .voice-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            opacity: 0.8;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            align-self: flex-start;
            max-width: 80%;
        }

        .n8n-chat-widget .typing-dots {
            display: flex;
            gap: 4px;
        }

        .n8n-chat-widget .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--chat--color-primary);
            animation: typing 1.4s infinite;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .n8n-chat-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .n8n-chat-widget .input-container {
            flex: 1;
            position: relative;
        }

        .n8n-chat-widget .chat-input textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            box-sizing: border-box;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .voice-button {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            color: var(--chat--color-primary);
            position: relative;
        }

        .n8n-chat-widget .voice-button:hover {
            background: rgba(133, 79, 255, 0.05);
        }

        .n8n-chat-widget .voice-button.recording {
            background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
            color: white;
            animation: pulse 1.5s infinite;
        }

        .n8n-chat-widget .voice-button.processing {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            cursor: not-allowed;
        }

        .n8n-chat-widget .voice-button svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .n8n-chat-widget .send-button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
            height: 44px;
        }

        .n8n-chat-widget .send-button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .send-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .n8n-chat-widget .recording-status {
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 71, 87, 0.9);
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: nowrap;
        }

        .n8n-chat-widget .recording-status.show {
            opacity: 1;
        }

        .n8n-chat-widget .processing-status {
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(243, 156, 18, 0.9);
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: nowrap;
        }

        .n8n-chat-widget .processing-status.show {
            opacity: 1;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Novo Automations',
                link: '#'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let isProcessing = false;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <div class="input-container">
                    <textarea placeholder="Type your message here..." rows="1"></textarea>
                </div>
                <button class="voice-button" title="Click to record voice message">
                    <div class="recording-status">Recording...</div>
                    <div class="processing-status">Processing...</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                </button>
                <button class="send-button" type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.send-button');
    const voiceButton = chatContainer.querySelector('.voice-button');
    const recordingStatus = chatContainer.querySelector('.recording-status');
    const processingStatus = chatContainer.querySelector('.processing-status');

    function generateUUID() {
        return crypto.randomUUID();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>AI is typing</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = {
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        };

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = responseData.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            errorDiv.textContent = 'Sorry, there was an error connecting. Please try again.';
            messagesContainer.appendChild(errorDiv);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        // Show user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator(typingIndicator);
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator(typingIndicator);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            errorDiv.textContent = 'Sorry, there was an error. Please try again.';
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function sendVoiceMessage(audioBlob) {
        // Show processing state
        isProcessing = true;
        voiceButton.classList.add('processing');
        processingStatus.classList.add('show');

        // Create FormData for voice message
        const formData = new FormData();
        
        // Create the message data structure
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: "",
                messageType: "voice"
            }
        };

        // Convert blob to proper audio format for n8n
        formData.append('audio', audioBlob, 'voice-message.webm');
        formData.append('data', JSON.stringify(messageData));

        // Show voice message in chat
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user voice';
        userMessageDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <span class="voice-indicator">Voice message</span>
        `;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator(typingIndicator);
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error sending voice message:', error);
            removeTypingIndicator(typingIndicator);
            
            // Show error message
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.textContent = 'Sorry, there was an error processing your voice message. Please try again.';
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            // Reset processing state
            isProcessing = false;
            voiceButton.classList.remove('processing');
            processingStatus.classList.remove('show');
        }
    }

    async function initializeVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
            
            // Try different mime types based on browser support
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = ''; // Let browser choose
                    }
                }
            }
            
            mediaRecorder = new MediaRecorder(stream, { 
                mimeType: mimeType || undefined
            });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { 
                    type: mediaRecorder.mimeType || 'audio/webm' 
                });
                audioChunks = [];
                sendVoiceMessage(audioBlob);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
                mediaRecorder = null; // Reset for next recording
            };

            return true;
        } catch (error) {
            console.error('Failed to initialize voice recording:', error);
            alert('Microphone access denied. Please allow microphone access to send voice messages.');
            return false;
        }
    }

    function startRecording() {
        if (!isRecording && !isProcessing && mediaRecorder && mediaRecorder.state === 'inactive') {
            audioChunks = [];
            mediaRecorder.start(1000); // Record in 1-second chunks
            isRecording = true;
            voiceButton.classList.add('recording');
            recordingStatus.classList.add('show');
        }
    }

    function stopRecording() {
        if (isRecording && mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            isRecording = false;
            voiceButton.classList.remove('recording');
            recordingStatus.classList.remove('show');
        }
    }

    // Event listeners
    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message && !isProcessing) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message && !isProcessing) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });

    // Voice recording event listeners
    voiceButton.addEventListener('click', async () => {
        if (isProcessing) return; // Don't allow new recordings while processing
        
        if (!isRecording) {
            // Start recording
            if (!mediaRecorder) {
                const initialized = await initializeVoiceRecording();
                if (!initialized) return;
            }
            startRecording();
        } else {
            // Stop recording
            stopRecording();
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    });

    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Disable send button when processing
    function updateSendButtonState() {
        sendButton.disabled = isProcessing;
        textarea.disabled = isProcessing;
    }

    // Update button states when processing changes
    const originalIsProcessing = isProcessing;
    Object.defineProperty(window, 'isProcessing', {
        get: () => originalIsProcessing,
        set: (value) => {
            originalIsProcessing = value;
            updateSendButtonState();
        }
    });
})();