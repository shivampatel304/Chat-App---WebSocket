import React, { useEffect, useState } from 'react';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);

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

    const sendMessage = () => {
        if (socket && input) {
            socket.send(input);
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Client</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
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
