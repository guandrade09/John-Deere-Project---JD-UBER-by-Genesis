const database = firebase.database();

const ticketList = document.getElementById('ticket-list');

// Função para carregar os tickets do Firebase
function loadTickets() {
    const ticketsRef = database.ref('tickets');
    
    // Ouvinte para mudanças no nó 'tickets'
    ticketsRef.on('value', (snapshot) => {
        ticketList.innerHTML = ''; // Limpa a lista antes de atualizar
        
        const data = snapshot.val();
        if (data) {
            for (let ticketId in data) {
                const ticketData = data[ticketId];
                const ticketNumber = ticketData.TicketNumber || 'Ticket Desconhecido'; // Acessa o valor de TicketNumber
                
                const ticketButton = document.createElement('button');
                ticketButton.className = 'ticket-button';
                ticketButton.innerHTML = `
                    <span>${ticketNumber}</span>
                    <img src="../../assets/mais-informacoes.png" alt="Ícone" class="ticket-icon">
                `;
                
                // Adiciona um evento de clique ao botão
                ticketButton.addEventListener('click', () => {
                    // Redireciona para a página de detalhes do ticket com o ticketId na URL
                    window.location.href = `ticket_detalhes.html?ticketId=${ticketId}`;
                });
                
                // Adiciona o botão à lista de tickets
                ticketList.appendChild(ticketButton);
            }
        } else {
            // Se não houver tickets, exibe uma mensagem opcional
            ticketList.innerHTML = '<p>No tickets available.</p>';
        }
    });
}

// Chama a função para carregar os tickets quando a página é carregada
loadTickets();
