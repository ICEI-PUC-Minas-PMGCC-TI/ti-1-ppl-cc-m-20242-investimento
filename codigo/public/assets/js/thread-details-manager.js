class ThreadDetailManager {
    constructor() {
        // Load threads and comments from localStorage
        this.threads = JSON.parse(localStorage.getItem('forumThreads')) || [];
        this.comments = JSON.parse(localStorage.getItem('forumComments')) || {};
    }

    // Get a specific thread by its ID
    getThreadById(threadId) {
        return this.threads.find(thread => thread.id === parseInt(threadId));
    }

    // Get comments for a specific thread
    getThreadComments(threadId) {
        return this.comments[threadId] || [];
    }

    // Add a new comment to a thread
    addComment(threadId, commentData) {
        // Ensure comments for this thread exist
        if (!this.comments[threadId]) {
            this.comments[threadId] = [];
        }

        // Create new comment object
        const newComment = {
            id: this.comments[threadId].length + 1,
            author: 'Usuário Atual', // In a real app, this would be the logged-in user
            content: commentData.content,
            createdAt: new Date()
        };

        // Add comment and update thread's reply count
        this.comments[threadId].push(newComment);
        
        // Find and update the thread's reply count
        const thread = this.getThreadById(threadId);
        if (thread) {
            thread.replies++;
        }

        // Save to localStorage
        this.saveComments();
        this.saveThreads();

        return newComment;
    }

    // Save comments to localStorage
    saveComments() {
        localStorage.setItem('forumComments', JSON.stringify(this.comments));
    }

    // Save threads to localStorage (to update reply count)
    saveThreads() {
        localStorage.setItem('forumThreads', JSON.stringify(this.threads));
    }

    // Render thread details
    renderThreadDetail(thread) {
        const container = document.getElementById('threadDetailContainer');
        if (!thread) {
            container.innerHTML = '<p>Tópico não encontrado.</p>';
            return;
        }

        // Render thread details
        container.innerHTML = `
            <div class="thread-detail">
                <div class="thread-detail-header">
                    <h2>${thread.title}</h2>
                    <div class="thread-detail-meta">
                        <span>Autor: ${thread.author}</span>
                        <span>Categoria: ${thread.category}</span>
                        <span>Criado em: ${new Date(thread.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="thread-detail-content">
                    <p>${thread.content}</p>
                </div>
                <div class="thread-detail-stats">
                    <span>Respostas: ${thread.replies}</span>
                    <span>Visualizações: ${thread.views}</span>
                </div>

                <div class="comments-section">
                    <h3>Comentários</h3>
                    <div id="commentsContainer"></div>

                    <form id="commentForm" class="comment-form">
                        <textarea id="commentContent" placeholder="Adicione seu comentário" required></textarea>
                        <button type="submit">Enviar Comentário</button>
                    </form>
                </div>
            </div>
        `;

        // Render comments
        this.renderComments(thread.id);

        // Setup comment form submission
        const commentForm = document.getElementById('commentForm');
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentContentEl = document.getElementById('commentContent');
            const commentContent = commentContentEl.value.trim();

            if (commentContent) {
                this.addComment(thread.id, { content: commentContent });
                commentContentEl.value = ''; // Clear textarea
                this.renderComments(thread.id);
            }
        });
    }

    // Render comments for a specific thread
    renderComments(threadId) {
        const commentsContainer = document.getElementById('commentsContainer');
        const comments = this.getThreadComments(threadId);

        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p>Seja o primeiro a comentar!</p>';
            return;
        }

        // Render comments
        const commentsHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
            </div>
        `).join('');

        commentsContainer.innerHTML = commentsHTML;
    }
}

// Initialize thread detail manager
const threadDetailManager = new ThreadDetailManager();

document.addEventListener('DOMContentLoaded', () => {
    // Get thread ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const threadId = urlParams.get('id');

    if (threadId) {
        // Find and render the specific thread
        const thread = threadDetailManager.getThreadById(threadId);
        threadDetailManager.renderThreadDetail(thread);
    }
});