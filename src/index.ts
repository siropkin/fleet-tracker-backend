import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import logger from "./utils/logger";
import racesPaths from "./paths/races";

const port = process.env.PORT ?? 5000;

const app = new Elysia()
    .use(logger)
    .use(cors())
    .get("/", (ctx) => {
        ctx.log.info(ctx.request, "Request");
        return { status: "ok" };
    })
    .group('/v1/races', (app) => app.use(racesPaths))
    .onError((ctx) => {
        console.error(ctx.error);
        if (ctx.code === 'NOT_FOUND') {
            return '🤖 Route not found'
        }
    })
    .listen(port);

console.log(`Server is running at ${app.server!.url}`);
