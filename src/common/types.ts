import { Express, Request } from 'express';

export type AppSession = Express.Session & SessionData

export type Poo = Request & {session?: AppSession}

export type SessionData = {
    room?: string;    
}

export enum MessageTypes {
    'JOIN'='JOIN'
}