const qrcode = require('qrcode-terminal');

const displayQRCode = (client) => {
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });
};

module.exports = { displayQRCode };
