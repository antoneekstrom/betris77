import { Request } from "express";

export function getUrl(req: Request): URL {
    return new URL(`${req.protocol}://${req.hostname + req.url}`);
}