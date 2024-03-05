import express from "express";
import fetch from "node-fetch";
import { FilterResponse } from "./filterResponse";
import { URLSearchParams } from "url";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const filterResponse = new FilterResponse();

// Middleware to parse JSON body in POST requests
app.use(express.json());

app.get(
  "/:formId/filteredResponses",
  async (req: express.Request, res: express.Response) => {
    const { formId } = req.params;
    const { filters, ...baseQueryParams } = req.query as any;
    const headers = {
      Authorization: req.headers.authorization || "",
    };

    try {
      const searchParams = new URLSearchParams(baseQueryParams).toString();
      const response = await fetch(
        `https://api.fillout.com/v1/api/forms/${formId}/submissions?${searchParams}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const json = await response.json();
      const filteredJson = filterResponse.filter(json, JSON.parse(filters));
      res.json(filteredJson);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
