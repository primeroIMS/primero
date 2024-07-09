// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getInsight = state => {
  return state.getIn(["records", NAMESPACE, "selectedReport"], fromJS({}));
};

export const getInsightFilters = state => {
  return state.getIn(["records", NAMESPACE, "filters"], fromJS({}));
};

export const getInsightExport = state => {
  return state.getIn(["records", NAMESPACE, "export"], fromJS({}));
};
