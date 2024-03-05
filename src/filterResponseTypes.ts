export type FilterClauseType = {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: number | string;
};

export type ResponseFiltersType = FilterClauseType[];

export type FilterResponseParams = {
  formId: string;
};

type FilterResponseOriginalQueryParams = {
  limit?: number;
  afterDate?: string;
  beforeDate?: string;
  offset?: number;
  status?: "in_progress" | "finished";
  includeEditLink?: boolean;
  sort?: "asc" | "desc";
};

export interface FilterResponseQueryParams
  extends FilterResponseOriginalQueryParams {
  filters: string;
}

export type AuthorizationHeader = { Authorization: string };

export type ResponseQuestion = {
  id: string;
  name: string;
  type: string;
  value: string;
};

export type SubmissionsResponse = {
  responses: { questions: ResponseQuestion[] }[];
  totalResponses: number;
  pageCount: number;
};
