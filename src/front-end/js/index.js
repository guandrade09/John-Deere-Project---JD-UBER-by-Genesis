 // Função de validação dos campos
 function validateFields() {
    const nomeValid = isNomeValid();
    const passwordValid = isPasswordValid();
    document.getElementById('login-button').disabled = !(nomeValid && passwordValid);
  }

  function isNomeValid() {
    const nome = document.getElementById("nome").value;
    return nome.length > 0;
  }

  function isPasswordValid() {
    const password = document.getElementById('password').value;
    return password.length > 0;
  }

  // Função de login e redirecionamento
  function login() {
const nome = document.getElementById('nome').value.trim().toUpperCase();
const password = document.getElementById('password').value.trim();

console.log(`Procurando usuário com nome: ${nome}`); // Adicionado para depuração

firebase.database().ref('Users').orderByChild('Nome').equalTo(nome).once('value')
  .then((snapshot) => {
    const usersData = snapshot.val();
    //console.log("Users Data:", usersData);

    if (usersData) {
      const userId = Object.keys(usersData)[0];
      const user = usersData[userId];

      console.log("User Data:", user);

      // Verifique a senha diretamente como string
      if (user.Senha === password) {
        // Armazena as informações do usuário no localStorage
        localStorage.setItem('user', JSON.stringify({
          nome: user.Nome,
          tipo: user.Tipo
        }));

        // Redirecionar com base no tipo
        if (user.Tipo === 'adm') window.location.href = 'telas/adm/categorias_adm.html';
        else if (user.Tipo === 'rebocador') window.location.href = 'telas/rebocador/categoria_rebocador.html';
        else if (user.Tipo === 'operador') window.location.href = 'telas/operador/categorias_operador.html';
      } else {
        alert('Usuário ou senha incorretos');
      }
    } else {
      alert('Usuário ou senha incorretos');
    }
  })
  .catch((error) => {
    //console.error('Erro:', error);
  });
}

  // Evento de submit do formulário
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
  });