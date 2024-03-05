"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({ logger: true });
server.get("/:formId/filteredResponses", async (request, reply) => {
    return { hello: "world" };
});
const start = async () => {
    try {
        await server.listen({
            port: 3000,
            listenTextResolver(address) {
                return `Server is listening at ${address}`;
            },
        });
        // console.log(`Server is listening on ${server.addresses()[0].port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
