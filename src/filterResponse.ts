import {
  FilterClauseType,
  ResponseFiltersType,
  ResponseQuestion,
  SubmissionsResponse,
} from "./filterResponseTypes";

export class FilterResponse {
  isoDateRegex =
    /^(\d{4}-[01]\d-[0-3]\d([T ][0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(([+-][0-2]\d:[0-5]\d)|Z)?)?)?$/i;

  constructor() {}

  filter(json: any, filter: ResponseFiltersType) {
    const data: SubmissionsResponse = json;
    const filteredResponses = data.responses.filter((r) =>
      this.isMatch(r.questions, filter)
    );
    return {
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: data.pageCount,
    };
  }

  private isMatch(questions: ResponseQuestion[], filter: ResponseFiltersType) {
    for (const f of filter) {
      const question = questions.find((q) => q.id == f.id);
      if (!question) continue;
      const conditionPassed = this.checkCondition(
        f.condition,
        question?.value,
        f.value
      );
      if (!conditionPassed) return false;
    }
    return true;
  }

  private conditions = {
    equals: (a: any, b: any) => a == b,
    does_not_equal: (a: any, b: any) => a != b,
    greater_than: (a: any, b: any) => a != null && a > b,
    less_than: (a: any, b: any) => a != null && a < b,
  };

  private checkCondition(
    operation: FilterClauseType["condition"],
    value1: any,
    value2: any
  ) {
    if (this.conditions[operation]) {
      if (this.isoDateRegex.test(value2)) {
        return this.conditions[operation](
          new Date(value1).getTime(),
          new Date(value2).getTime()
        );
      }
      console.log(value1, value2, this.conditions[operation](value1, value2));
      return this.conditions[operation](value1, value2);
    }
    throw new Error("Invalid operation");
  }
}
