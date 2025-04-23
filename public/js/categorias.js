document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const form = document.getElementById('categoriaForm');
    if (form) {
        form.addEventListener('submit', salvarCategoria);
    }

    if (document.getElementById('listaCategorias')) {
        carregarCategorias();
    }
});

async function carregarCategorias() {
    try {
        const response = await fetch('/api/categorias', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('Erro ao carregar categorias');

        const categorias = await response.json();
        const tbody = document.getElementById('listaCategorias');
        tbody.innerHTML = '';
        
        categorias.forEach(categoria => {
            tbody.innerHTML += `
                <tr>
                    <td>${categoria.name || ''}</td>
                    <td>${categoria.description || ''}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCategoria(${categoria.id})">Editar</button>
                        <button class="btn btn-danger btn-sm ms-2" onclick="deletarCategoria(${categoria.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar categorias');
    }
}

async function salvarCategoria(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch('/api/categorias/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: formData.get('name'),
                description: formData.get('description')
            })
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('Erro ao salvar categoria');

        window.location.href = '/categorias';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar categoria');
    }
}

async function deletarCategoria(id) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('Erro ao excluir categoria');

        window.location.reload();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir categoria');
    }
}

async function editarCategoria(id) {
    window.location.href = `/categorias/editar/${id}`;
} 