
JD UBER - Projeto Challenge John Deere - FIAP
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

# Testes de Desempenho

## Teste de Precisão de Localização

### Definição da Ferramenta de Teste

Um dos maiores desafios nesse projeto foi a volatilidade do RSSI dos roteadores. Sendo assim, uma das alternativas pra deixar o sinal mais preciso foi utilizar o Filtro de Kalman, evitando com que ocorram resultados de coordenadas muito divergentes das anteriores.
Aqui é um bloco do código:

```
KalmanFilter kf1 = {0.1, 5, 0, 0.7, 0); // JDUBER_01
KalmanFilter kf2 = {0.1, 5, 0, 0.7, 0); // JDUBER_02
KalmanFilter kf3 = {0.2, 5, 0, 1.0, 0); // JDUBER_03
KalmanFilter kf4 = (0.2, 5, 0, 1.0, 0); // JDUBER_04

float kalmanFilter(float measurement, KalmanFilter &kf) { kf.Pkf.Pkt.Q;
}
kf.K kf.P (kt.P+ kf.R);
kf.X kf.X+kf.K (measurement kf.X);
kf.P (1kf.K) kt.P;
return kf.X;
```

### Evidências de Testes

```
Mensagen publicada [Rebocador]: 247.57, 176.24 
Mensagem publicada [Rebocador]: 268.32, 178.87
Mensagem publicada [Rebocador]: 251.10, 153.96
```

O algoritmo mantém a precisão dos resultados mais recentes para mostrar a localização sem alterações bruscas mesmo com volatilidade dos sinais de RSSIs dos roteadores.

### Discussão dos Resultados

O algoritmo mantém a precisão dos resultados mais recentes para mostrar a localização sem alterações bruscas mesmo com volatilidade dos sinais de RSSIs dos roteadores.

É um dos melhores métodos de algoritmo para filtragem de dados. Roteadores são muito imprecisos para cálculos de distância no geral, porém o Filtro de Kalman ajuda a se basear nos últimos resultados obtidos.

### Soluções Futuras

Há várias formas de implementar o FIltro de Kalman nos códigos de Arduino. Achamos a mais conveniente e conectável com o nosso código. Para soluções de projetos futuros com dados sensíveis como RSSI é a utilização de tempo de resposta para cálculo de distância juntamente com outros algoritmos de suporte para essas funções.

## Teste de Estabilidade de Sinal

### Definição da Ferramenta de Teste

Uma outra estratégia de filtragem de dados e resultados é a média ponderada padrão em um curto periodo de tempo. Fazendo com que os RSSIs dos roteadores não sofram tamanha alteração na extração de dados.

Aqui está o bloco de código para obter o RSSI dos roteadores juntamente com o filtro básico de média ponderada:

```
for (int i = 0; i < w; ++i) {
    String current_ssid = WiFi.SSID(i);
    if (current_ssid == ssid1 || current_ssid == ssid2 || current_ssid == ssid3 || current_ssid == ssid4) {
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? " " : "*");
      
      if (current_ssid == ssid1) {
        for(int r = 0; r <= 100; r++){
          sinal1 = WiFi.RSSI(i);
          soma1 = sinal1 + soma1;
        }
        rssi1 = (soma1/100);
      } else if (current_ssid == ssid2) {
        for(int r = 0; r <= 100; r++){
          sinal2 = WiFi.RSSI(i);
          soma2 = sinal2 + soma2;
        }
        rssi2 = (soma2/100);
      } else if (current_ssid == ssid3) {
        for(int r = 0; r <= 100; r++){
          sinal3 = WiFi.RSSI(i);
          soma3 = sinal3 + soma3;
        }
        rssi3 = (soma3/100);
      } else if (current_ssid == ssid4) {
        for(int r = 0; r <= 100; r++){
          sinal4 = WiFi.RSSI(i);
          soma4 = sinal4 + soma4;
        }
        rssi4 = (soma4/100);
      }
    }
  }
```

### Evidências de Testes

```
Esp teste(-54)
Esp teste 1 (-31)
Esp teste 2 (-57)
Esp teste 3 (-62)
Mensagem publicada [Rebocador]: 371.09, 286.93
Mensagem publicada [Rebocador]: 385.21, 301.71
Mensagem publicada [Rebocador]: 379.58, 293.10
```

### Discussão dos Resultados

Os resultados dos roteadores foram suavisados, podendo ter mais resultados precisos e estáveis mesmo com uma boa frequência. O método pode ser mais acurado ainda com a utilização de funções de tempo, para processar mais dados e realizar a filtragem, porém, não é tão indicado para esse projeto porque o Server MQTT já tem um tempo de espera próprio.

### Soluções Futuras

Para melhorias no projeto, nós utilizariamos outros algoritimos que utilizam de base a média ponderada mas de forma mais bem elaborada e completa. Importante pesquisar um método de reunir muitos dados em um tempo médio, onde dá janela de oportunidade de reunir uma boa quantia de dados e que não demore muito tempo a ser realizado.
