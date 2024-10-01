const database = firebase.database();

// Função para gerar um número aleatório de 6 dígitos
function gerarNumeroAleatorio() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Função para enviar os dados
function enviarDados() {
    console.log('Função enviarDados chamada');

    // Coleta os valores dos checkboxes de impacto
    const impactosSelecionados = Array.from(document.querySelectorAll('input[name="impacto"]:checked'))
        .map(cb => cb.nextElementSibling.nextElementSibling.textContent);

    // Coleta os valores dos checkboxes de problemas
    const problemasSelecionados = Array.from(document.querySelectorAll('input[name="impacto1"]:checked'))
        .map(cb => cb.nextElementSibling.nextElementSibling.textContent);

    // Gera o número do ticket
    const ticketNumber = `Ticket ${gerarNumeroAleatorio()}`;

    // Obtém a data atual
    const dataEnvio = new Date().toLocaleDateString(); // Formato padrão: DD/MM/AAAA

    // Cria o objeto com os dados a serem enviados
    const dados = {
        TicketNumber: ticketNumber,
        Impacto: impactosSelecionados.join(', '), // Converte o array para uma string
        Problemas: problemasSelecionados.join(', '), // Converte o array para uma string
        DataEnvio: dataEnvio // Adiciona a data atual
    };

    console.log('Dados a serem enviados:', dados);

    // Adiciona um novo ticket no banco de dados
    database.ref('tickets/' + ticketNumber).set(dados)
        .then(() => {
            console.log('Dados enviados com sucesso!');
            alert('Dados enviados com sucesso!');
            // Opcional: Limpar os campos após o envio
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        })
        .catch((error) => {
            console.error('Erro ao enviar dados: ', error);
            alert('Ocorreu um erro ao enviar os dados.');
        });
}

// Adiciona o listener de evento ao botão Enviar
document.querySelector('.button').addEventListener('click', function() {
    console.log('Botão Enviar clicado');
    enviarDados();
});

// Código existente para os checkboxes de impacto
const checkboxesImpacto = document.querySelectorAll('input[name="impacto"]');

checkboxesImpacto.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxesImpacto.forEach((cb) => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

// Código existente para os checkboxes de problemas
const checkboxesProblemas = document.querySelectorAll('input[name="impacto1"]');

checkboxesProblemas.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxesProblemas.forEach((cb) => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

document.getElementById('btnvoltar').addEventListener('click', function() {
    window.history.back();
});
