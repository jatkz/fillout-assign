"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const filterResponse_1 = require("./filterResponse");
const url_1 = require("url");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const filterResponse = new filterResponse_1.FilterResponse();
// Middleware to parse JSON body in POST requests
app.use(express_1.default.json());
app.get("/:formId/filteredResponses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    const _a = req.query, { filters } = _a, baseQueryParams = __rest(_a, ["filters"]);
    const headers = {
        Authorization: req.headers.authorization || "",
    };
    try {
        const searchParams = new url_1.URLSearchParams(baseQueryParams).toString();
        const response = yield (0, node_fetch_1.default)(`https://api.fillout.com/v1/api/forms/${formId}/submissions?${searchParams}`, {
            headers,
        });
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const json = yield response.json();
        const filteredJson = filterResponse.filter(json, JSON.parse(filters));
        res.json(filteredJson);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});
