/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectInsights = state => {
  return state.getIn(["records", NAMESPACE, "data"], fromJS([]));
};

export const selectInsightsPagination = state => {
  return state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
};

export const selectLoading = state => {
  return state.getIn(["records", NAMESPACE, "loading"], false);
};
