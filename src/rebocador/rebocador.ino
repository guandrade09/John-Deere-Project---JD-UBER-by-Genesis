#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// Configuração WIFI
const char* ssid = "Andras";
const char* password = "Andrade01";
const char* ssid1 = "Esp teste 0";
const char* ssid2 = "Esp teste 1";
const char* ssid3 = "Esp teste 2";

// Configuração MQTT
const char* mqtt_server = "0b6b323f43f1448e93217add8c825f7d.s1.eu.hivemq.cloud";
const char* mqtt_username = "genesis1";
const char* mqtt_password = "ASDa12345";
const int mqtt_port = 8883;

// Certificado Root CA
static const char *root_ca PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";

WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
char msg[50];
int value = 0;

struct Point {
  double x, y;
};

// Configuração do WiFi
void setup_wifi() {
  Serial.begin(9600);
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());

  espClient.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);
}

// Função para reconectar ao servidor MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("conectado");
      client.subscribe("Rebocador");
    } else {
      Serial.print("falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(1000);
    }
  }
}

// Função para publicar mensagens MQTT
void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), retained)) {
    Serial.println("Mensagem publicada [" + String(topic) + "]: " + payload);
  } else {
    Serial.println("Falha ao publicar a mensagem");
  }
}

double calculateDistance(int rssi) {  
  int txPower = -60; 
  if (rssi == 0) {
    return -1.0;
  }
  double ratio = (double)rssi / txPower;
  if (ratio < 1.0) {
    return pow(ratio, 10);
  } else {
    double distance =  (0.89976) * pow(ratio, 7.7095) + 0.111;
    return distance;
  }
}

void calculatePosition(double d1, double d2, double d3, Point p1, Point p2, Point p3, Point &position) {
  double x1 = p1.x;
  double y1 = p1.y;
  double x2 = p2.x;
  double y2 = p2.y;
  double x3 = p3.x;
  double y3 = p3.y;

  // Cálculo de posição para 3 pontos utilizando médias ponderadas
  position.x = (d1*x1 + d2*x2 + d3*x3) / (d1 + d2 + d3);
  position.y = (d1*y1 + d2*y2 + d3*y3) / (d1 + d2 + d3);
}

void setup () {
  setup_wifi();
}

void loop () {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int w = WiFi.scanNetworks();  
  int rssi1 = 0, rssi2 = 0, rssi3 = 0;
  int sinal1 = 0, sinal2 = 0, sinal3 = 0;
  int soma1 = 0, soma2 = 0, soma3 = 0;
  
  for (int i = 0; i < w; ++i) {
    String current_ssid = WiFi.SSID(i);
    if (current_ssid == ssid1 || current_ssid == ssid2 || current_ssid == ssid3) {
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
      }
    }
  }

  // Cálculo de distâncias baseadas em RSSI
  double distance1 = calculateDistance(rssi1); 
  double distance2 = calculateDistance(rssi2); 
  double distance3 = calculateDistance(rssi3);

  Point p1 = {250, 125}; // Coordenadas fictícias para os pontos
  Point p2 = {125, 375};
  Point p3 = {375, 375};
  
  Point position;
  calculatePosition(distance1, distance2, distance3, p1, p2, p3, position);

  String xy = String(position.x) + "," + String(position.y);
  publishMessage("Rebocador", xy, true);

  delay(100);
}
