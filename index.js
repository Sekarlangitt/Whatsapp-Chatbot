const dotenv = require('dotenv');
const { setupClient } = require('./config.js');
const { handleMessage } = require('./messageHandler.js');

dotenv.config(); // Load environment variables from .env

const client = setupClient();

client.on('message', async (msg) => {
    try {
        await handleMessage(msg);
    } catch (error) {
        console.error("Error handling message:", error);
    }
});

client.initialize(); // Initialize WhatsApp client
