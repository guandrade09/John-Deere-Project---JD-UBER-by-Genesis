function loadMenu() {
    fetch('../../telas/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-container').innerHTML = data;
            initializeLogout(); // Inicializa o logout após o menu ser carregado
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));
}

function initializeLogout() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('Botão de logout clicado');
            // Remove o usuário do localStorage
            localStorage.removeItem('user');
            
            // Redireciona para a página inicial ou de login
            window.location.href = '../../index.html'; // Altere conforme o caminho da sua página inicial
        });
    } else {
        console.error('Botão de logout não encontrado');
    }
}

// Chama a função para carregar o menu após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', loadMenu);
