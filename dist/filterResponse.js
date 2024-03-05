"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterResponse = void 0;
class FilterResponse {
    constructor() {
        this.isoDateRegex = /^(\d{4}-[01]\d-[0-3]\d([T ][0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(([+-][0-2]\d:[0-5]\d)|Z)?)?)?$/i;
        this.conditions = {
            equals: (a, b) => a == b,
            does_not_equal: (a, b) => a != b,
            greater_than: (a, b) => a != null && a > b,
            less_than: (a, b) => a != null && a < b,
        };
    }
    filter(json, filter) {
        const data = json;
        const filteredResponses = data.responses.filter((r) => this.isMatch(r.questions, filter));
        return {
            responses: filteredResponses,
            totalResponses: filteredResponses.length,
            pageCount: data.pageCount,
        };
    }
    isMatch(questions, filter) {
        for (const f of filter) {
            const question = questions.find((q) => q.id == f.id);
            if (!question)
                continue;
            const conditionPassed = this.checkCondition(f.condition, question === null || question === void 0 ? void 0 : question.value, f.value);
            if (!conditionPassed)
                return false;
        }
        return true;
    }
    checkCondition(operation, value1, value2) {
        if (this.conditions[operation]) {
            if (this.isoDateRegex.test(value2)) {
                return this.conditions[operation](new Date(value1).getTime(), new Date(value2).getTime());
            }
            return this.conditions[operation](value1, value2);
        }
        throw new Error("Invalid operation");
    }
}
exports.FilterResponse = FilterResponse;
