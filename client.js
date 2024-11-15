const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8080');

// Create interface for client console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ws.on('open', () => {
    console.log('Connected to the server');
    console.log('Type your messages:');
});

ws.on('message', (message) => {
    console.log(`\n${message}`);
});

ws.on('close', () => {
    console.log('Disconnected from the server');
    rl.close();
    process.exit(0);
});

// Handle client-side input
rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
        ws.close();
        rl.close();
        process.exit(0);
    }
    ws.send(input);
});
