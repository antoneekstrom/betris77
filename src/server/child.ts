import { createServer } from 'http';
import createSocket from 'socket.io';

process.on('message', msg => {
    if (msg?.type == 'socket') {
        console.log("SOCKET", msg?.socket != undefined);
    }
})