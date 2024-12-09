class ForumManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/threads';
    }

    async fetchThreads() {
        const response = await fetch(this.apiBaseUrl);
        if (!response.ok) {
            throw new Error('Erro ao carregar tópicos');
        }
        return await response.json();
    }

    async createThread(threadData) {
        const response = await fetch(this.apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(threadData)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar tópico');
        }

        return await response.json();
    }

    renderThreads(threads) {
        const container = document.getElementById('threadsContainer');
        container.innerHTML = '';

        threads.forEach(thread => {
            const threadElement = document.createElement('div');
            threadElement.classList.add('thread-item');
            threadElement.innerHTML = `
                <div class="thread-details">
                    <h3 class="thread-link" data-thread-id="${thread.id}">${thread.title}</h3>
                    <div class="thread-meta">
                        Por ${thread.author} | Categoria: ${thread.category} |
                        ${new Date(thread.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <div class="thread-stats">
                    <span>Respostas: ${thread.replies}</span>
                    <span>Visualizações: ${thread.views}</span>
                </div>
            `;
            container.appendChild(threadElement);

            const threadLink = threadElement.querySelector('.thread-link');
            threadLink.addEventListener('click', () => {
                // This will pass the thread ID to the URL and redirect
                window.location.href = `discussaoDuvidas.html?id=${thread.id}`;
            });
        });
    }
}

const forumManager = new ForumManager();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const threads = await forumManager.fetchThreads();
        forumManager.renderThreads(threads);
    } catch (error) {
        alert('Erro ao carregar os tópicos');
        console.error(error);
    }

    const createThreadBtn = document.getElementById('createThreadBtn');
    createThreadBtn.addEventListener('click', () => {
        document.getElementById('createThreadModal').style.display = 'block';
    });

    const modalCloseBtn = document.querySelector('.close-modal');
    modalCloseBtn.addEventListener('click', () => {
        document.getElementById('createThreadModal').style.display = 'none';
    });

    const newThreadForm = document.getElementById('newThreadForm');
    newThreadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const threadData = {
            title: document.getElementById('threadTitle').value,
            content: document.getElementById('threadContent').value,
            category: document.getElementById('threadCategory').value,
            author: 'Usuário',
            createdAt: new Date().toISOString(),
            replies: 0,
            views: 0
        };

        try {
            await forumManager.createThread(threadData);
            alert('Tópico criado com sucesso!');
            window.location.reload();
        } catch (error) {
            alert('Erro ao criar o tópico');
            console.error(error);
        }
    });
});
