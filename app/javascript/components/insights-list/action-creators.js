/* eslint-disable import/prefer-default-export */

import { cleanUpFilters } from "../records/utils";

import actions from "./actions";

export const fetchInsights = data => ({
  type: actions.FETCH_INSIGHTS,
  api: {
    path: "managed_reports",
    params: cleanUpFilters(data.options)
  }
});

export const setFilters = data => ({
  type: actions.SET_INSIGHT_FILTERS,
  payload: data
});

export const clearFilters = () => ({ type: actions.CLEAR_INSIGHT_FILTERS });
