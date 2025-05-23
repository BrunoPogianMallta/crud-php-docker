const API_URL = 'http://localhost:8080';

async function makeRequest(method, endpoint, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}

// funções da API
window.api = {
    login: (email, password) => makeRequest('POST', '/login', { email, password }),
    register: (name, email, password) => makeRequest('POST', '/register', { name, email, password }),
    createPost: (title, content) => makeRequest('POST', '/posts', { title, content }),
    getPosts: () => makeRequest('GET', '/posts'),
    getPost: (id) => makeRequest('GET', `/posts/${id}`),
    updatePost: (id, title, content) => makeRequest('PUT', `/posts/${id}`, { title, content }),
    deletePost: (id) => makeRequest('DELETE', `/posts/${id}`)
};