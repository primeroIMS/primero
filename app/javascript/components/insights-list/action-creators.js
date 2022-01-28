/* eslint-disable import/prefer-default-export */

import { cleanUpFilters } from "../records/utils";

import { FETCH_INSIGHTS } from "./actions";

export const fetchInsights = data => {
  return {
    type: FETCH_INSIGHTS,
    api: {
      path: "managed_reports",
      params: cleanUpFilters(data.options)
    }
  };
};
