const mqtt = require('mqtt');
const axios = require('axios');

// Configurações do broker MQTT
const brokerUrl = "mqtts://c760f45a730a4f4484c69a818287e40c.s1.eu.hivemq.cloud";
const options = {
    port: 8883,
    username: "iot_teste",
    password: "1qaZ2wsX",
    protocol: "mqtts", // Protocolo seguro
    rejectUnauthorized: false // Ignora certificados inválidos (opcional)
};

// Configurações do Telegram
const telegramToken = "8029029392:AAFPhwrT9EAdey95xQzWcWrmzgOdjoHi2qk";
const chatId = "321591726";

// Conecte-se ao broker MQTT
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Conectado ao broker MQTT!');
    // Inscreva-se no tópico desejado
    client.subscribe("teste/topic", (err) => {
        if (err) {
            console.error('Erro ao assinar o tópico:', err);
        } else {
            console.log('Inscrito no tópico: teste/topic');
        }
    });
});

client.on('message', (topic, message) => {
    const msgText = message.toString();
    console.log(`Mensagem recebida no tópico ${topic}:`, msgText);

    // Enviar mensagem para o Telegram
    sendToTelegram(msgText);
});

// Função para enviar mensagem para o Telegram
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const data = {
        chat_id: chatId,
        text: message
    };

    axios.post(url, data)
        .then(response => {
            console.log('Mensagem enviada para o Telegram:', response.data);
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem para o Telegram:', error.message);
        });
}

client.on('error', (err) => {
    console.error('Erro de conexão MQTT:', err);
});

