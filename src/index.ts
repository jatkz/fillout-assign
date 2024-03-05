import fastify, { FastifyRequest } from "fastify";
import {
  AuthorizationHeader,
  FilterResponseParams,
  FilterResponseQueryParams,
} from "./filterResponseTypes";
import ky from "ky";
import { FilterResponse } from "./filterResponse";

const server = fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3000;

const filterResponse = new FilterResponse();

server.get<{
  Params: FilterResponseParams;
  Querystring: FilterResponseQueryParams;
  Headers: AuthorizationHeader;
}>("/:formId/filteredResponses", async (request, reply) => {
  const { formId } = request.params;
  const { filters, ...baseQueryParams } = request.query;

  const json = await ky
    .get(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, {
      headers: {
        Authorization: request.headers.authorization,
      },
      searchParams: baseQueryParams,
    })
    .json();

  const filteredJson = filterResponse.filter(json, JSON.parse(filters));
  return filteredJson;
});

const start = async () => {
  try {
    await server.listen({
      port: PORT,
      host: "0.0.0.0",
      listenTextResolver(address) {
        return `Server is listening at ${address}`;
      },
    });
    // console.log(`Server is listening on ${server.addresses()[0].port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
