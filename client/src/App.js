import React, { useEffect, useState } from 'react';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState('');

    useEffect(() => {
        // Connect to the WebSocket server
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            console.log(`Message from server: ${event.data}`);
            setMessages((prev) => [...prev, event.data]);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        setSocket(ws);

        // Cleanup: Close WebSocket connection when the component unmounts
        return () => ws.close();
    }, []);

    const joinRoom = () => {
        if(socket && room){
            const joinMessage = JSON.stringify({type: 'join', room});
            socket.send(joinMessage);
        }
    }

    const sendMessage = () => {
        if (socket && input) {
            const chatMessage = JSON.stringify({type: 'message', text:input})
            socket.send(chatMessage);
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Client</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter room name"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <h2>Messages:</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
