/* eslint-disable import/prefer-default-export */

import { cleanUpFilters } from "../records/utils";

import { FETCH_INSIGHTS } from "./actions";

export const fetchReports = data => {
  return {
    type: FETCH_INSIGHTS,
    api: {
      path: "reports",
      params: cleanUpFilters(data.options)
    }
  };
};
