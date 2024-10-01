const database = firebase.database();

// Função para voltar à tela anterior
function goBack() {
    window.history.back();
}

// Inicializa o mapa
const map = L.map('map', {
    zoomControl: true,
    dragging: true,
    scrollWheelZoom: true,
    touchZoom: true,
    minZoom: 1,
    maxZoom: 4
}).setView([0, 0], 1);

// Define a URL da imagem
const imageUrl = '../../assets/planta.png';

// Define as coordenadas da imagem para cobrir toda a área do mapa
const imageBounds = [
    [-90, -180],
    [90, 180]
];

// Adiciona a imagem ao mapa
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);
map.setMaxBounds(imageBounds);
map.on('drag', function() {
    map.panInsideBounds(imageBounds, { animate: false });
});

// Armazena os pedidos já exibidos
let displayedOrders = [];

// Função para aceitar um pedido
function acceptOrder(orderId, acceptButton) {
    const orderRef = database.ref('pedidos/' + orderId);
    orderRef.update({
        status: 'Aceito'
    }).then(() => {
        acceptButton.style.display = 'none';
        
        // Adiciona uma marcação no mapa após aceitar o pedido
        addMarkerForOrder(orderId);
        // Adiciona uma segunda marcação no mapa
        addSecondMarkerForOrder(orderId);
        checkForPendingOrders();
    }).catch((error) => {
        console.error("Erro ao aceitar o pedido:", error);
    });
}

// Função para adicionar uma marcação no mapa
function addMarkerForOrder(orderId) {
    const orderCoordinates = [-5.5505, -90.6333]; // Exemplo: coordenadas da primeira marcação
    L.marker(orderCoordinates).addTo(map).bindPopup(`Pedido ${orderId} aceito`).openPopup();
}

// Função para adicionar uma segunda marcação no mapa com uma imagem personalizada
function addSecondMarkerForOrder(orderId) {
    // Coordenadas ajustadas para ficarem mais distantes
    const secondOrderCoordinates = [-22.5505, 150.6333]; // Coordenadas da segunda marcação, mais afastadas

    const customIconUrl = '../../assets/carrinho.png'; // Substitua pela URL da sua imagem
    const customIcon = L.icon({
        iconUrl: customIconUrl,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    // Adiciona a segunda marcação no mapa
    L.marker(secondOrderCoordinates, { icon: customIcon })
        .addTo(map)
        .openPopup();
}

// Resto do código permanece inalterado...

// Função para remover o pedido após 12 horas
function removeOrderAfterFiveSeconds(orderId) {
    const fiveSecondsInMs = 43200000; 
    setTimeout(() => {
        const orderRef = database.ref('pedidos/' + orderId);
        orderRef.remove()
        .then(() => {
            console.log(`Pedido ${orderId} removido automaticamente após 5 segundos.`);
        })
        .catch((error) => {
            console.error(`Erro ao remover o pedido ${orderId}:`, error);
        });
    }, fiveSecondsInMs);
}

// Função para buscar pedidos do Firebase e iniciar o processo de remoção
function loadOrders() {
    const orderListRef = database.ref('pedidos');
    orderListRef.on('value', (snapshot) => {
        const orders = snapshot.val();
        console.log("Dados recebidos do Firebase:", orders); // Log para verificar os dados
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = ''; // Limpa a lista antes de atualizar

        let newOrders = [];
        let hasNewOrders = false; // Flag para identificar novos pedidos

        if (orders) {
            for (const key in orders) {
                const order = orders[key];
                // Verifica se a ordem tem os campos necessários
                if (order.kitName && order.status && order.timestamp) {
                    newOrders.push(key); // Armazena novos pedidos

                    const listItem = document.createElement('li');
                    listItem.innerText = `Kit: ${order.kitName} - Status: ${order.status} - Pedido feito em: ${new Date(order.timestamp).toLocaleString()}`;

                    // Adiciona o botão de aceitar somente se o status for diferente de "Aceito"
                    if (order.status !== 'Aceito') {
                        const acceptButton = document.createElement('button');
                        acceptButton.innerText = 'Aceitar';
                        acceptButton.classList.add('accept-button-class'); // Adiciona a classe ao botão
                        acceptButton.onclick = () => acceptOrder(key, acceptButton); // Define a ação do botão
                        listItem.appendChild(acceptButton); // Adiciona o botão ao item da lista
                        hasNewOrders = true; // Marcar que há pedidos não aceitos
                    }

                    orderList.appendChild(listItem);

                    // Inicia a remoção automática após 5 segundos
                    removeOrderAfterFiveSeconds(key);
                } else {
                    console.error(`Ordem com ID ${key} não possui todos os campos necessários.`);
                }
            }

            // Verifica se há novos pedidos em relação aos já exibidos
            const isNewOrder = newOrders.some(order => !displayedOrders.includes(order));

            if (isNewOrder && hasNewOrders) {
                // Toca o som de notificação e exibe a bolinha até o pedido ser aceito
                showNotification();
            }

            // Atualiza os pedidos exibidos
            displayedOrders = [...newOrders];
        } else {
            orderList.innerHTML = '<li>Nenhum pedido encontrado.</li>'; // Mensagem caso não haja pedidos
        }
    }, (error) => {
        console.error("Erro ao buscar pedidos:", error);
    });
}

// Função para verificar se há pedidos pendentes
function checkForPendingOrders() {
    const orderListRef = database.ref('pedidos');
    orderListRef.once('value', (snapshot) => {
        const orders = snapshot.val();
        if (orders) {
            const pendingOrders = Object.values(orders).some(order => order.status !== 'Aceito');
            if (!pendingOrders) {
                hideNotification(); // Esconde a bolinha e para o som se não houver pedidos pendentes
            }
        } else {
            hideNotification(); // Esconde a bolinha e para o som se não houver pedidos
        }
    });
}

// Função para mostrar ou esconder a lista de pedidos
function toggleOrderList() {
    const orderDetails = document.getElementById('orderDetails');
    const isVisible = orderDetails.style.display === 'block';
    orderDetails.style.display = isVisible ? 'none' : 'block'; // Alterna a visibilidade
    if (!isVisible) {
        loadOrders(); // Carrega pedidos ao abrir a lista
    }
}

// Função para mostrar a bolinha de notificação e tocar o som
function showNotification() {
    const notificationBall = document.getElementById('notificationBall');
    const notificationSound = document.getElementById('notificationSound');
    notificationBall.style.display = 'block'; // Mostra a bolinha
    notificationBall.style.animation = 'pulse 1s infinite'; // Adiciona a animação de pulsação
    notificationSound.play(); // Toca o som
}

// Função para esconder a bolinha de notificação e parar o som
function hideNotification() {
    const notificationBall = document.getElementById('notificationBall');
    const notificationSound = document.getElementById('notificationSound');
    notificationBall.style.display = 'none'; // Esconde a bolinha
    notificationBall.style.animation = ''; // Remove a animação
    notificationSound.pause(); // Para o som
    notificationSound.currentTime = 0; // Reseta o tempo do som
}

// Carrega os pedidos assim que a página é carregada
loadOrders();
