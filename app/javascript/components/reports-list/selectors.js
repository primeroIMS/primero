// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectReports = state => {
  return state.getIn(["records", NAMESPACE, "data"], fromJS([]));
};

export const selectReportsPagination = state => {
  return state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
};

export const selectLoading = state => {
  return state.getIn(["records", NAMESPACE, "loading"], false);
};
