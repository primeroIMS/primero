/* eslint-disable import/prefer-default-export */

import { cleanUpFilters } from "../../records/utils";

import { FETCH_REPORTS } from "./actions";

export const fetchReports = data => {
  return {
    type: FETCH_REPORTS,
    api: {
      path: "reports",
      params: cleanUpFilters(data.options)
    }
  };
};
