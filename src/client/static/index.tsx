import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

const socket = io();

function App() {

    useEffect(onSocket, []);
    const [roomCode, setRoomCode] = useState();
    const [connections, setConnections] = useState([]);

    fetchConnections();

    return (
        <div>
            <h1>{roomCode}</h1>
            <ul>
                {connections.map((c, i) => <li key={i}><h3>{c}</h3></li>)}
            </ul>
        </div>
    )

    function onSocket() {
        socket.on('room_code', data => {
            setRoomCode(data);
        })

        socket.on('connections_changed', fetchConnections);
    }

    function fetchConnections() {
        socket.emit('connections', response => {
            setConnections(response);
        })
    }
}

ReactDOM.render(<App/>, document.querySelector('#root'));