// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import filtersToQueryString from "./utils/filters-to-query-string";

const getNamespacePath = namespace => ["records"].concat(namespace);

export const getListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], fromJS([]));

export const getFields = state => state.getIn(["forms", "fields"], fromJS([]));

export const getMetadata = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("metadata"), fromJS({}));

export const getAppliedFilters = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("filters"), fromJS({}));

export const getAppliedFiltersAsQueryString = (state, namespace) => {
  const filters = filtersToQueryString(getAppliedFilters(state, namespace));

  return filters;
};

export const getLoading = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("loading"), false);

export const getErrors = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("errors"), false);

export const getDrawer = state => state.getIn(["ui", "drawers"], fromJS({}));
