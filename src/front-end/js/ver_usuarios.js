// Configuração do Firebase já deve estar feita em firebase-database.js
const dbRef = firebase.database().ref();

// Referência para a lista de usuários no banco de dados
const usersRef = dbRef.child('Users'); // Substitua 'Users' pelo nome do nó onde os usuários estão armazenados

// Referência ao elemento HTML onde os usuários serão listados
const userList = document.getElementById('userList');

// Referência ao input de pesquisa
const searchInput = document.getElementById('searchInput');

// Função para carregar e exibir os usuários
usersRef.on('value', (snapshot) => {
    const users = snapshot.val();
    displayUsers(users); // Exibe todos os usuários inicialmente

    // Filtra os usuários quando o input de pesquisa é alterado
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = {};

        for (let userId in users) {
            const user = users[userId];
            const userName = user.Nome ? user.Nome.toLowerCase() : ''; // Tratando o caso de 'undefined'
            if (userName.includes(searchTerm)) {
                filteredUsers[userId] = user;
            }
        }

        displayUsers(filteredUsers);
    });
}, (error) => {
    console.error('Erro ao recuperar os usuários: ', error);
});

// Função para exibir os usuários
function displayUsers(users) {
    userList.innerHTML = ''; // Limpa a lista antes de adicionar os dados

    for (let userId in users) {
        const user = users[userId];
        const item = document.createElement('div');
        item.className = 'item';
        
        // Criando um botão/elemento clicável para o nome
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `Nome: ${user.Nome}`;
        nameSpan.style.cursor = 'pointer';
        nameSpan.onclick = () => {
            // Alterna a visibilidade das informações extras
            if (item.querySelector('.user-details')) {
                item.removeChild(item.querySelector('.user-details'));
            } else {
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'user-details';
                detailsDiv.innerHTML = `<span>Tipo: ${user.Tipo}</span> <span>Email: ${user.Email}</span> <span>Senha: ${user.Senha}</span>`;
                item.appendChild(detailsDiv);
            }
        };

        item.appendChild(nameSpan);
        userList.appendChild(item);
    }
}
