const urlParams = new URLSearchParams(window.location.search);
const profileName = urlParams.get('name'); 

if (profileName) {
    document.getElementById('profileName').textContent = decodeURIComponent(profileName);
}

const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message', 'sent');
        messageBubble.innerHTML = `<p>${messageText}</p>`;

        messagesContainer.appendChild(messageBubble);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

function simulateResponse() {
    setTimeout(() => {
        const replyBubble = document.createElement('div');
        replyBubble.classList.add('message', 'received');
        replyBubble.innerHTML = `<p>Mensagem de teste</p>`;

        messagesContainer.appendChild(replyBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000); 
}

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message', 'sent');
        messageBubble.innerHTML = `<p>${messageText}</p>`;

        messagesContainer.appendChild(messageBubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        messageInput.value = '';
        
        simulateResponse();
    }
});
