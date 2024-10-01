// Função de cadastro
function register() {
  const nome = document.getElementById('nome').value.trim().toUpperCase();
  const email = document.getElementById('email').value.trim().toUpperCase();
  const password = document.getElementById('password').value.trim();
  const tipo = document.querySelector('input[name="value-radio"]:checked').value;

  const userData = {
    Nome: nome,
    Email: email,
    Senha: password,
    Tipo: tipo
  };

  firebase.database().ref('Users/' + nome).set(userData)
    .then(() => {
      alert('Usuário cadastrado com sucesso!');
      
      // Limpar todos os campos do formulário
      document.getElementById('registerForm').reset();

      // Desmarcar os radio buttons
      const radios = document.querySelectorAll('input[name="value-radio"]');
      radios.forEach(radio => radio.checked = false);
    })
    .catch((error) => {
      alert('Erro ao cadastrar usuário: ' + error.message);
    });
}

// Evento de submit do formulário
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  register();
});







