class ForumManager {
    constructor() {
        this.threads = JSON.parse(localStorage.getItem('forumThreads')) || [
            {
                id: 1,
                title: 'Melhores estratégias de investimento em 2024',
                author: 'João Silva',
                category: 'investimentos',
                content: 'Quais são as estratégias de investimento mais promissoras para este ano?',
                createdAt: new Date('2024-01-15T10:30:00'),
                replies: 5,
                views: 124
            },
            {
                id: 2,
                title: 'Dúvidas sobre declaração de imposto de renda',
                author: 'Maria Souza',
                category: 'financas-pessoais',
                content: 'Preciso de orientações sobre como declarar investimentos na minha declaração.',
                createdAt: new Date('2024-02-01T14:45:00'),
                replies: 3,
                views: 87
            }
        ];
    }

    saveThreads() {
        localStorage.setItem('forumThreads', JSON.stringify(this.threads));
    }

    createThread(threadData) {
        const newThread = {
            id: this.threads.length + 1,
            title: threadData.title,
            author: 'Usuário Atual', 
            category: threadData.category,
            content: threadData.content,
            createdAt: new Date(),
            replies: 0,
            views: 0
        };

        this.threads.unshift(newThread);
        this.saveThreads();
        return newThread;
    }

    searchThreads(query) {
        query = query.toLowerCase();
        return this.threads.filter(thread => 
            thread.title.toLowerCase().includes(query) || 
            thread.content.toLowerCase().includes(query)
        );
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
                        Por ${thread.author} | 
                        Categoria: ${thread.category} | 
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
                thread.views++;
                this.saveThreads();

                window.location.href = `discussaoDuvidas.html?id=${thread.id}`;
            });
        });
    }
}

const forumManager = new ForumManager();

document.addEventListener('DOMContentLoaded', () => {
    forumManager.renderThreads(forumManager.threads);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const filteredThreads = forumManager.searchThreads(query);
        forumManager.renderThreads(filteredThreads);
    });

    const createThreadBtn = document.getElementById('createThreadBtn');
    const createThreadModal = document.getElementById('createThreadModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const newThreadForm = document.getElementById('newThreadForm');

    createThreadBtn.addEventListener('click', () => {
        createThreadModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        createThreadModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === createThreadModal) {
            createThreadModal.style.display = 'none';
        }
    });


    newThreadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const threadTitle = document.getElementById('threadTitle').value;
        const threadContent = document.getElementById('threadContent').value;
        const threadCategory = document.getElementById('threadCategory').value;

        if (!threadTitle || !threadContent || !threadCategory) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const newThread = forumManager.createThread({
            title: threadTitle,
            content: threadContent,
            category: threadCategory
        });

        forumManager.renderThreads(forumManager.threads);

        newThreadForm.reset();
        createThreadModal.style.display = 'none';
    });


});