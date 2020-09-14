import express, { Request, Response, Express } from 'express';
import { fork } from 'child_process';
import * as path from 'path';
import { createServer } from 'http';
import createSocket, { Socket, Server } from 'socket.io';
import session from 'express-session';
import sharedSession from 'express-socket.io-session';
import { handleRoomRoute, ROOM_ROUTE } from './room';
import { AppSession } from '../common/types';

const server = serve();
server.run();

export default function serve(port: number = 80) {
    const app = express();
    const http = createServer(app);
    const io = createSocket(http);

    configureSession(app, io);
    configureSocket(io);
    configureRoutes(app);

    function run() {
        http.listen(port);
    }

    return { app, run, http, io };
}

type Room = {id: string, connections: string[]}
let rooms: Room[] = []

function configureSocket(io: Server) {
    io.on('connection', socket => {
        const roomId = (socket.handshake.session as AppSession)?.room;
        const id = socket.client.id;

        if (roomId != undefined && roomId != '') {
            let room: Room;

            if (!(room = rooms.find(r => r.id == roomId))) {
                room = {
                    id: roomId,
                    connections: []
                };
                rooms.push(room);
            }

            socket.join(roomId);
            socket.emit('room_code', roomId);
            
            room.connections.push(id);
            io.to(roomId).emit('connections_changed');

            socket.on('disconnect', () => {
                room.connections = room.connections.filter(c => c != id);
                io.to(roomId).emit('connections_changed');
            })

            socket.on('connections', (respond) => {
                respond(room.connections);
            })
        }
    })
}

function configureSession(app: Express, io: Server) {
    const sessionMiddleware = session({
        secret: 'poo',
        resave: true,
        saveUninitialized: true
    });
    app.use(sessionMiddleware);
    io.use(sharedSession(sessionMiddleware, {
        autoSave: true
    }));
}

function configureRoutes(app: Express) {
    app.use('/static', express.static(path.resolve(__dirname, '../../build/public')));
    app.get('/', servePage);
    app.get([ROOM_ROUTE, ROOM_ROUTE + '/*'], (req, res) => {
        handleRoomRoute(req, res);
        servePage(req, res);
    });

    function servePage(req: Request, res: Response) {
        const page = path.join(__dirname, '../public/index.html');
        res.sendFile(page);
    }
}