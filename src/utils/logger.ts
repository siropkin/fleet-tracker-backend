import { logger } from "@bogeychan/elysia-logger";

const env = process.env.NODE_ENV ?? "development";

export default logger({
    level: env === "development" ? "debug" : "error",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
