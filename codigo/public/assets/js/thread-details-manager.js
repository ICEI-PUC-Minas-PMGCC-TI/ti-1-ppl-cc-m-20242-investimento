class ThreadDetailManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/threads';
    }

    async fetchThreadById(id) {
        const response = await fetch(`${this.apiBaseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o tópico');
        }
        return await response.json();
    }

    async createReply(threadId, replyContent) {
        const reply = {
            author: 'Usuário',
            content: replyContent,
            createdAt: new Date().toISOString()
        };

        const thread = await this.fetchThreadById(threadId);
        thread.replies = thread.replies || [];
        thread.replies.push(reply);

        const response = await fetch(`${this.apiBaseUrl}/${threadId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(thread)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar resposta');
        }

        return await response.json();
    }

    renderThreadDetail(thread) {
        const container = document.getElementById('threadDetailContainer');
        container.innerHTML = `
            <div class="thread-detail">
                <h2>${thread.title}</h2>
                <div class="thread-meta">
                    <span>Por ${thread.author}</span> | 
                    <span>Categoria: ${thread.category}</span> | 
                    <span>${new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
                <p>${thread.content}</p>
            </div>

            <div class="replies-section">
                <h3>Respostas</h3>
                <div id="repliesContainer"></div>

                <form id="replyForm">
                    <textarea id="replyContent" placeholder="Escreva sua resposta..." required></textarea>
                    <button type="submit">Enviar Resposta</button>
                </form>
            </div>
        `;
    }

    renderReplies(replies) {
        const repliesContainer = document.getElementById('repliesContainer');
        repliesContainer.innerHTML = '';

        replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.classList.add('reply-item');
            replyElement.innerHTML = `
                <div class="reply-meta">
                    <span>${reply.author}</span> | 
                    <span>${new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p>${reply.content}</p>
            `;
            repliesContainer.appendChild(replyElement);
        });
    }
}

const threadDetailManager = new ThreadDetailManager();

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const threadId = urlParams.get('id');

    if (!threadId) {
        alert('Tópico não encontrado');
        return;
    }

    try {
        const thread = await threadDetailManager.fetchThreadById(threadId);
        threadDetailManager.renderThreadDetail(thread);
        threadDetailManager.renderReplies(thread.replies || []);
    } catch (error) {
        alert('Erro ao carregar o tópico. Tente novamente.');
        console.error(error);
    }

    const replyForm = document.getElementById('replyForm');
    replyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const replyContent = document.getElementById('replyContent').value;

        if (!replyContent) {
            alert('Por favor, escreva uma resposta.');
            return;
        }

        try {
            const updatedThread = await threadDetailManager.createReply(threadId, replyContent);
            threadDetailManager.renderThreadDetail(updatedThread);
            threadDetailManager.renderReplies(updatedThread.replies);
            replyForm.reset();
        } catch (error) {
            alert('Erro ao enviar resposta. Tente novamente.');
            console.error(error);
        }
    });
});
