document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const isListPage = !window.location.pathname.includes('/criar');
    if (isListPage) {
        carregarProdutos();
    } else {
        carregarCategorias();
    }

    const form = document.getElementById('formProduto');
    if (form) {
        form.addEventListener('submit', salvarProduto);
    }
});

async function carregarCategorias() {
    try {
        const response = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('Erro ao carregar categorias');

        const categorias = await response.json();
        const selectCategoria = document.getElementById('categoria');
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
        
        categorias.forEach(categoria => {
            selectCategoria.innerHTML += `<option value="${categoria.id}">${categoria.name}</option>`;
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar categorias');
    }
}

async function carregarProdutos() {
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('Erro ao carregar produtos');

        const produtos = await response.json();
        const tbody = document.getElementById('listaProdutos');
        tbody.innerHTML = '';
        
        produtos.forEach(produto => {
            const preco = produto.price ? `R$ ${parseFloat(produto.price).toFixed(2)}` : 'Não definido';
            const categoria = produto.category ? produto.category.name : 'Sem categoria';
            
            tbody.innerHTML += `
                <tr>
                    <td>${produto.name || ''}</td>
                    <td>${produto.description || ''}</td>
                    <td>${preco}</td>
                    <td>${categoria}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm ms-2" onclick="deletarProduto(${produto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar produtos');
    }
}

async function salvarProduto(event) {
    event.preventDefault();

    try {
        const nome = document.getElementById('nome').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const preco = document.getElementById('preco').value;
        const categoriaId = document.getElementById('categoria').value;

        if (!nome || nome.length < 3) {
            throw new Error('O nome do produto deve ter pelo menos 3 caracteres');
        }
        if (!descricao || descricao.length < 10) {
            throw new Error('A descrição do produto deve ter pelo menos 10 caracteres');
        }
        if (!preco || preco <= 0) {
            throw new Error('O preço deve ser maior que zero');
        }
        if (!categoriaId) {
            throw new Error('Selecione uma categoria');
        }

        const produto = {
            name: nome,
            description: descricao,
            price: Number(preco),
            categoryId: Number(categoriaId)
        };

        console.log('Dados do produto a serem enviados:', produto);

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
    
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produto)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.erro || responseData.error || responseData.message || 
                          `Erro ao criar produto (${response.status})`);
        }

        console.log('Produto criado com sucesso:', responseData);
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(error.message || 'Erro ao criar produto. Por favor, tente novamente.');
    }
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }

        await carregarProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir produto');
    }
}

async function editarProduto(id) {
    window.location.href = `/produtos/editar/${id}`;
} 