# JD UBER - Projeto Challenge John Deere - FIAP
Grupo Genesis 1ECR - Engenharia da Computação

# Introdução

A proposta de solução do projeto da John Deere se consiste em criar uma API WEB que tem a função de mostrar aos operadores de rebocadores todos os carrinhos com kit de peças de montagem mais próximos, 
indicando o status de peso do carrinho e a rota que leva menos tempo para chegar nesse carrinho. Para isso, precisa-se criar um mapa virtual utilizando trilangulação para estimular a posição dos componentes.
Então, nossa principal estratégia é utilizar roteadores Wi-Fi com microcontroladores ESP32 e fazer a triangulação a partir da posição e RSSI (Received Signal Strength Indicator) de cada roteador, 
retornando um mapeamento dos carrinhos e rebocadores.


O projeto há alguns desafios, o principal sendo a impossibilidade de utilizar a estratégia de módulos de GPS devido ao teto do armazém ser de metal, causando o efeito de Gaiola de Faraday.
Isso pode causar muita imprecisão e até mesmo deixar de funcionar.

<div>
  <a href="https://github.com/guandrade09/John-Deere-Project---JD-UBER-by-Genesis">
    <img src="assets\JDLogo.png" alt="Logo" width="1920" height="480">
  </a>
<div/>

# Desenvolvimento

<div>
  <a href="https://github.com/guandrade09/John-Deere-Project---JD-UBER-by-Genesis">
    <img src="assets\DIAGRAMA.png" alt="Logo" width="1920" height="960">
  </a>
<div/>

## Hardware

### Esp32 - Roteador (com antena)

* Esp32 configurado como um roteador Wi-Fi para utilização do RSSI fornecido.

### Esp32 - Carrinho

* Esp32 configurado para conectar em um server MQTT (HiveMQ).
* Receber resultados da célula de carga HX711.
* Calcular a triangulação utilizando RSSI dos Esp32 Roteadores.

### Esp32 - Rebocador

* Esp32 configurado para conectar em um server MQTT (HiveMQ).
* Calcular a triangulação utilizando RSSI dos Esp32 Roteadores.

### Célula de Carga

* Utilizamos a balança de 50kg apenas para testes.
* Auxílio do módulo HX711 para conversão e escala.

## Software

### API WEB

* Interface Intuitiva para Operadores e Rebocadores: Desenvolver uma interface de usuário amigável e eficiente para que operadores possam solicitar peças e rebocadores possam visualizar as rotas e locais de entrega de forma clara e direta.

* Comunicação Eficiente: Garantir que os pedidos feitos por operadores apareçam em tempo real para todos os aplicativos conectados na rede, permitindo uma comunicação e coordenação eficiente entre todos os envolvidos.

* Melhoria na Produtividade: Reduzir o tempo gasto na localização de peças e na execução de tarefas, resultando em uma maior produtividade e redução de custos operacionais.

## Integração

### HiveMQ (MQTT Server)

* Ponte entre o código dos Esp32 com o API WEB.
* Recebe mensagens do ESP32 para se mostrar o visual no front-end.
* Utilizamos um server gratuito para testes.

## Video Explicativo

[JDUber - Apresentação Final - Grupo Genesis - FIAP 1ECR](https://youtu.be/t7did-2Pubg)
