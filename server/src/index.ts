import { WebSocketServer, WebSocket } from 'ws';

// Create a WebSocket server on port 8080
const server = new WebSocketServer({ port: 8080 });

// Handle connections
server.on('connection', (socket: WebSocket) => {
    console.log('Client connected');

    // Send a welcome message
    socket.send('Welcome to the WebSocket server!');

    // Handle incoming messages
    socket.on('message', (message: string) => {
        console.log(`Received: ${message}`);

        server.clients.forEach((client) =>{
            if(client.readyState === WebSocket.OPEN){
                client.send(`broadcast : ${message}`)
            }
        })
        socket.send(`You sent: ${message}`);
    });

    // Handle disconnection
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
