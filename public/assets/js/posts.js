// renderizar posts
window.renderPosts = function(posts) {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';

    if (posts.length === 0) {
        postsList.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="actions">
                <button onclick="editPost('${post.id}')">Editar</button>
                <button onclick="deletePost('${post.id}')">Excluir</button>
            </div>
        `;
        postsList.appendChild(postElement);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('token')) return;

    //  criar post
    document.getElementById('create-post-btn').addEventListener('click', () => {
        document.getElementById('post-form-container').style.display = 'block';
        document.getElementById('post-form').reset();
        document.getElementById('post-id').value = '';
    });

    // Cancelar edição/criação
    document.getElementById('cancel-post-btn').addEventListener('click', () => {
        document.getElementById('post-form-container').style.display = 'none';
    });

    // Salvar post 
    document.getElementById('post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('post-id').value;
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        try {
            if (id) {
                await window.api.updatePost(id, title, content);
            } else {
                await window.api.createPost(title, content);
            }
            document.getElementById('post-form-container').style.display = 'none';
            window.loadPosts();
        } catch (error) {
            alert(error.message);
        }
    });
});


window.editPost = async function(id) {
    try {
        const post = await window.api.getPost(id);
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-form-container').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
};

window.deletePost = async function(id) {
    if (confirm('Tem certeza que deseja excluir este post?')) {
        try {
            await window.api.deletePost(id);
            window.loadPosts();
        } catch (error) {
            alert(error.message);
        }
    }
};