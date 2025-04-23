document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        await Promise.all([
            carregarProdutos(),
            carregarCategorias(),
            carregarFeedbacks()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function carregarProdutos() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }

        const produtos = await response.json();
        const listaProdutos = document.getElementById('listaProdutos');
        if (!listaProdutos) return;
        
        listaProdutos.innerHTML = '';

        produtos.forEach(produto => {
            const preco = produto.price ? `R$ ${parseFloat(produto.price).toFixed(2)}` : 'Não definido';
            const categoria = produto.category ? escapeHtml(produto.category.name) : 'Sem categoria';
            
            listaProdutos.innerHTML += `
                <tr>
                    <td>${escapeHtml(produto.name)}</td>
                    <td>${escapeHtml(produto.description)}</td>
                    <td>${preco}</td>
                    <td>${categoria}</td>
                    <td>
                        <button onclick="editarProduto(${produto.id})" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="deletarProduto(${produto.id})" class="btn btn-danger btn-sm ms-2">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

async function carregarCategorias() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/api/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao carregar categorias');
        }

        const categorias = await response.json();
        const tbody = document.getElementById('listaCategorias');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        categorias.forEach(categoria => {
            tbody.innerHTML += `
                <tr>
                    <td>${escapeHtml(categoria.name)}</td>
                    <td>${escapeHtml(categoria.description || 'N/A')}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCategoria(${categoria.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm ms-2" onclick="deletarCategoria(${categoria.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias. Por favor, tente novamente.');
    }
}

async function carregarFeedbacks() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/api/feedbacks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao carregar feedbacks');
        }

        const feedbacks = await response.json();
        const tbody = document.getElementById('listaFeedbacks');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        feedbacks.forEach(feedback => {
            const data = new Date(feedback.createdAt).toLocaleDateString('pt-BR');
            const produtoNome = feedback.Product ? escapeHtml(feedback.Product.name) : 'N/A';
            const estrelas = '⭐'.repeat(feedback.rating);
            
            tbody.innerHTML += `
                <tr>
                    <td>${produtoNome}</td>
                    <td>${estrelas}</td>
                    <td>${escapeHtml(feedback.comment)}</td>
                    <td>${data}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deletarFeedback(${feedback.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar feedbacks:', error);
        alert('Erro ao carregar feedbacks. Por favor, tente novamente.');
    }
}

async function editarProduto(id) {
    window.location.href = `/produtos/editar/${id}`;
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }

        carregarProdutos();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto. Por favor, tente novamente.');
    }
}

async function editarCategoria(id) {
    window.location.href = `/categorias/editar/${id}`;
}

async function deletarCategoria(id) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao excluir categoria');
        }

        carregarCategorias();
    } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        alert('Erro ao excluir categoria. Por favor, tente novamente.');
    }
}

async function deletarFeedback(id) {
    if (!confirm('Tem certeza que deseja excluir este feedback?')) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch(`/api/feedbacks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao excluir feedback');
        }

        carregarFeedbacks();
    } catch (error) {
        console.error('Erro ao excluir feedback:', error);
        alert('Erro ao excluir feedback. Por favor, tente novamente.');
    }
} 