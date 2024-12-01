const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const setupClient = () => {
    const client = new Client();

    client.on('qr', (qr) => {
        console.log("Scan QR Code berikut:");
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log("Bot siap digunakan!");
    });

    return client;
};

module.exports = { setupClient };
