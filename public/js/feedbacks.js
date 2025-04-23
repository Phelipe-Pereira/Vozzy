document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
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

        const produtos = await response.json();
        const selectProduto = document.getElementById('produto');
        if (selectProduto) {
            selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
            produtos.forEach(produto => {
                selectProduto.innerHTML += `<option value="${produto.id}">${produto.name}</option>`;
            });
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Por favor, tente novamente.');
    }

    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', salvarFeedback);
    }
});

async function salvarFeedback(event) {
    event.preventDefault();

    try {
        const produtoId = document.getElementById('produto').value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comentario = document.getElementById('comentario').value.trim();

        // Validações
        if (!produtoId) {
            throw new Error('Selecione um produto');
        }
        if (!rating) {
            throw new Error('Selecione uma avaliação (1 a 5 estrelas)');
        }
        if (!comentario) {
            throw new Error('O comentário é obrigatório');
        }

        const feedback = {
            productId: Number(produtoId),
            rating: Number(rating),
            comment: comentario
        };

        console.log('Dados do feedback a serem enviados:', feedback);

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch('/api/feedbacks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(feedback)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || errorData.error || errorData.message || 
                          `Erro ao criar feedback (${response.status})`);
        }

        const data = await response.json();
        console.log('Feedback criado com sucesso:', data);
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(error.message || 'Erro ao salvar feedback. Por favor, tente novamente.');
    }
}

async function carregarFeedbacks() {
    try {
        const response = await fetch('/api/feedbacks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const feedbacks = await response.json();
        const tbody = document.getElementById('listaFeedbacks');
        tbody.innerHTML = '';
        
        feedbacks.forEach(feedback => {
            tbody.innerHTML += `
                <tr>
                    <td>${feedback.product ? feedback.product.name : 'N/A'}</td>
                    <td>${feedback.rating}</td>
                    <td>${feedback.comment}</td>
                    <td>${new Date(feedback.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deletarFeedback(${feedback.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar feedbacks:', error);
    }
}

async function deletarFeedback(id) {
    if (!confirm('Tem certeza que deseja excluir este feedback?')) {
        return;
    }

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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao excluir feedback');
        }

        window.location.reload();
    } catch (error) {
        console.error('Erro ao excluir feedback:', error);
        alert(error.message || 'Erro ao excluir feedback. Por favor, tente novamente.');
    }
} 