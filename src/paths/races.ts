import { Elysia } from "elysia";
import logger from "../utils/logger";
import parsePositions from "../utils/parsePositions";

const races = new Elysia()
    .use(logger)
    .get("/", (ctx) => {
        ctx.log.debug(ctx.request, "Request");
        return { status: "ok" };
    })
    .get("/:id/setup", async (ctx) => {
        ctx.log.debug(ctx.request, "Request");
        const url = `https://yb.tl/JSON/${ctx.params.id}/RaceSetup`;
        const response = await fetch(url);
        const body = await response.text();
        const bodyJson = JSON.parse(body);
        return {
            id: bodyJson.url,
            course: bodyJson.course,
            other: bodyJson,
        };
    })
    .get("/:id/leaderboard", async (ctx) => {
        ctx.log.debug(ctx.request, "Request");
        const url = `https://yb.tl/JSON/${ctx.params.id}/leaderboard`;
        const response = await fetch(url);
        const body = await response.text();
        return JSON.parse(body);
    })
    .get("/:id/positions-all", async (ctx) => {
        ctx.log.debug(ctx.request, "Request");
        const url = `https://yb.tl/BIN/${ctx.params.id}/AllPositions3`;
        const response = await fetch(url);
        const body = await response.arrayBuffer();
        return parsePositions(body);
    })
    .get("/:id/positions-latest", async (ctx) => {
        ctx.log.debug(ctx.request, "Request");
        const url = `https://yb.tl/BIN/${ctx.params.id}/LatestPositions3`;
        const response = await fetch(url);
        const body = await response.arrayBuffer();
        return parsePositions(body);
    })

export default races;
