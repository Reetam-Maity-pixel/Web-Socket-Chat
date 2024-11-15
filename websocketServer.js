const { WebSocket, WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

console.log('WebSocket server is running on ws://localhost:8080');

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
