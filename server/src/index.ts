import { WebSocketServer, WebSocket } from 'ws';

// Create a WebSocket server on port 8080
const server = new WebSocketServer({ port: 8080 });

const room: Record<string, Set<WebSocket>> = {};

// Handle connections
server.on('connection', (socket: WebSocket) => {
    console.log('Client connected');

    let currentRoom: string | null = null;

    // Handle incoming messages
    socket.on('message', (data: string) => {
        const message = JSON.parse(data);

        if(message.type === 'join'){
            const roomName = message.room;

            if(!room[roomName]){
                room[roomName] = new Set();
            }

            room[roomName].add(socket);
            currentRoom = roomName;

            console.log(`Client joined room : ${roomName}`);
            socket.send(`You joined room: ${roomName}`);

        }else if(message.type === 'message'){
            if(currentRoom && room[currentRoom]){
                room[currentRoom].forEach((client) =>{
                    if(client.readyState === WebSocket.OPEN){
                        client.send(`Room ${currentRoom} : ${message.text}`)
                    }
                })
            }
        }
    });

    // Handle disconnection
    socket.on('close', () => {
        if(currentRoom && room[currentRoom]){
            room[currentRoom].delete(socket);

            if(room[currentRoom].size === 0){
                delete room[currentRoom];
            }
        }

        console.log('Client disconnected');

    });
});

console.log('WebSocket server is running on ws://localhost:8080');
