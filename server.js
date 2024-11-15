const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const wss = new WebSocket.Server({ server });
const clients = new Set();

// Your existing WebSocket code here
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        const messageStr = message.toString();
        console.log(`Received message: ${messageStr}`);

        if (messageStr.startsWith('SEEN:')) {
            const timestamp = messageStr.substring(5);
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(`SEEN:${timestamp}`);
                }
            });
        } else {
            const timestamp = Date.now().toString();
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(`MSG:${timestamp}|${messageStr}`);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});


// Add CORS headers for security
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 