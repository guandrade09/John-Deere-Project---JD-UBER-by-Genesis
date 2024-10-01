function checkUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
  
    // Definindo as páginas permitidas para cada tipo de usuário
    const allowedPages = {
        adm: ['cadastro.html', 'categorias_adm.html', 'opcoes_usuario.html' , 'ver_usuarios' , 'categoria_rebocador.html', 'problemasproducao_rebocador.html', 'categorias_operador.html', 'pesquisa_kits-operador', 'pesquisa_peças-operador.html', 'problemasdeproducao_operador.html','mapa.html' ], // Admin tem acesso a todas as páginas
        rebocador: ['categoria_rebocador.html', 'problemasproducao_rebocador.html','ticket.html', 'ticket_detalhes.html', 'mapa.html' ], // Rebocador tem acesso a páginas específicas
        operador: ['categorias_operador.html', 'pesquisa_pecas-operador.html', 'pesquisa_kits-operador.html', 'problemasdeproducao_operador.html', 'ticket.html', 'ticket_detalhes.html'] // Operador tem acesso a outras páginas específicas
    };
  
    if (user) {
        const userType = user.tipo; // Tipo de usuário armazenado
  
        // Se o usuário é admin, tem acesso total
        if (userType === 'adm') {
            return; // Usuário admin tem acesso a todas as páginas, nenhuma restrição é necessária
        } else if (userType === 'rebocador' || userType === 'operador') {
            const currentPage = window.location.pathname.split('/').pop(); // Obtém o nome da página atual
            console.log(`Página atual: ${currentPage}`); // Adiciona um log para verificar o nome da página
  
            // Verifica se a página atual está na lista de páginas permitidas para o tipo de usuário
            if (!allowedPages[userType].includes(currentPage)) {
                window.location.href = '../../index.html';
                alert('Você não tem acesso a esta página!'); // Mensagem de acesso negado
            }
        } else {
            window.location.href = '../../index.html';
            alert('Tipo de usuário inválido ou não permitido!');
        }
    } else {
        window.location.href = '../../index.html';
        alert('Não está logado!'); // Altere conforme necessário
    }
  }
  
  // Verifica o usuário ao carregar a página
  window.onload = checkUser;
  