async function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Erro ao salvar o token de autenticação');
                return;
            }
            
            const dashboardResponse = await fetch('/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (dashboardResponse.ok) {
                window.location.href = '/dashboard';
            } else {
                const errorData = await dashboardResponse.json();
                alert(errorData.error || 'Erro ao acessar o dashboard');
            }
        } else {
            alert(data.erro || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', fazerLogin);
    }
}); 