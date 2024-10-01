// Inicializa o Firebase
const database = firebase.database();

// Obtém o parâmetro 'ticketId' da URL
const urlParams = new URLSearchParams(window.location.search);
const ticketId = urlParams.get('ticketId');

// Elementos onde as informações serão exibidas
const ticketDetailsContainer = document.getElementById('ticket-details');
const statusTextContainer = document.getElementById('status-text');

// Função para carregar os detalhes do ticket
function loadTicketDetails() {
    if (ticketId) {
        const ticketRef = database.ref(`tickets/${ticketId}`);
        
        // Busca os dados do ticket específico no Firebase
        ticketRef.once('value', (snapshot) => {
            const ticketData = snapshot.val();
            if (ticketData) {
                // Exibindo as informações do ticket dentro do ticket-info
                document.querySelector('.ticket-info').innerHTML = `
                    <h2>Detalhes do ${ticketData.TicketNumber || 'Ticket'}</h2>
                    <p><strong>Problemas na Produção...</strong></p>
                    <p><strong>Impacto:</strong> ${ticketData.Impacto || 'N/A'}</p>
                    <p><strong>Problemas:</strong> ${ticketData.Problemas || 'N/A'}</p>
                    <p><strong>Data Lançada:</strong> ${ticketData.DataEnvio || 'N/A'}</p>
                `;
                
                // Atualizando o status da operação (simulando dados aqui)
                statusTextContainer.innerText = 'Operação em andamento. Acompanhe as atualizações.';
            } else {
                ticketDetailsContainer.innerHTML = '<p>Ticket não encontrado.</p>';
            }
        }).catch((error) => {
            console.error('Erro ao buscar os detalhes do ticket:', error);
            ticketDetailsContainer.innerHTML = '<p>Erro ao carregar os detalhes do ticket.</p>';
        });
    } else {
        ticketDetailsContainer.innerHTML = '<p>Nenhum ticket selecionado.</p>';
    }
}

// Chama a função para carregar os detalhes do ticket ao carregar a página
loadTicketDetails();
