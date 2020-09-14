import { Request, Response } from "express";
import { getUrl } from "./util";
import { AppSession } from '../common/types';

export const ROOM_ROUTE = '/lobby';

export function handleRoomRoute(req: Request, res: Response) {
    const path = getUrl(req).pathname.split(/[/\\]/g).filter(d => d != '');

    if (path.length < 2) {
        res.redirect('/');
        return;
    }
    else if (path.length > 2) {
        res.redirect(['', path.slice(0, 3)].join('/'));
        return;
    }

    req.session.room = path.pop();
}