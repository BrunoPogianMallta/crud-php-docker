const addPostsStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .post {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
        }
        .post h3 {
            margin-top: 0;
            color: #333;
        }
        .error-message {
            color: #721c24;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .loading-message {
            color: #0c5460;
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
};

// Função para mostrar a seção de posts
function showPostsSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('posts-section').style.display = 'block';
    window.loadPosts();
}

// Função global para carregar posts
window.loadPosts = async function() {
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = '<div class="loading-message">Carregando posts...</div>';
    }

    try {
        const response = await window.api.getPosts();
        console.debug('API Response:', response); // Debug
        
        // arruma formato da response
        let posts = response;
        
      
        if (response && typeof response === 'object') {
            if (Array.isArray(response.data)) {
                posts = response.data; 
            } else if (Array.isArray(response.posts)) {
                posts = response.posts; 
            } else if (Array.isArray(response.items)) {
                posts = response.items; 
            }
        } else if (typeof response === 'string') {
            try {
                posts = JSON.parse(response);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
            }
        }

        // Validate posts format
        if (!Array.isArray(posts)) {
            console.error('Invalid posts format:', posts);
            throw new Error(`Formato inválido de posts. Esperado array, recebido: ${typeof posts}`);
        }

        window.renderPosts(posts);
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="error-message">
                    Erro ao carregar posts: ${error.message || 'Erro desconhecido'}
                    <button onclick="window.loadPosts()">Tentar novamente</button>
                </div>
            `;
        }
    }
};

// Função global para renderizar posts
window.renderPosts = function(posts) {
    try {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
            throw new Error('Elemento posts-container não encontrado');
        }

        postsContainer.innerHTML = '';

        if (!Array.isArray(posts)) {
            throw new Error('Posts não é um array válido');
        }

        if (posts.length === 0) {
            postsContainer.innerHTML = '<div class="post">Nenhum post encontrado.</div>';
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title || 'Sem título'}</h3>
                <p>${post.content || ''}</p>
                <small>Por: ${post.author || 'Autor desconhecido'}</small>
                ${post.createdAt ? `<br><small>Em: ${new Date(post.createdAt).toLocaleString()}</small>` : ''}
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao renderizar posts:', error);
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="error-message">
                    Erro ao exibir posts: ${error.message || 'Erro desconhecido'}
                </div>
            `;
        }
    }
};

// inicia aplicacao
document.addEventListener('DOMContentLoaded', () => {
    addPostsStyles(); 
    
    // Check  status
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token
        showPostsSection();
    }


    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            const { token, user } = await window.api.login(email, password);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            showPostsSection();
        } catch (error) {
            alert(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
            console.error('Login error:', error);
        }
    });

    // Registration 
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        if (!name || !email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            await window.api.register(name, email, password);
            alert('Conta criada com sucesso! Faça login.');
            document.getElementById('register-form').reset();
            document.getElementById('login-tab').click();
        } catch (error) {
            alert(error.message || 'Erro ao registrar. O email pode já estar em uso.');
            console.error('Registration error:', error);
        }
    });

    // Logout 
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    });

    const refreshBtn = document.getElementById('refresh-posts');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', window.loadPosts);
    }
});