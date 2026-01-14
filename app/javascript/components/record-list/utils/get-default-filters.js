// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
import { DEFAULT_FILTERS, DEFAULT_FILTERS_WITH_MODULE_ID } from "../constants";
import { fromJS } from "immutable";

const defaultFiltersConstant = (modules, userModules) => {

  if (modules?.size > 1) {
    return {
      ...DEFAULT_FILTERS,
      module_id: [...userModules?.map(m => m.get("unique_id"))]
    };
  }

  return DEFAULT_FILTERS;

}

export default ({queryParams, metadata, modules, userModules }) => {
  const filters = defaultFiltersConstant(modules, userModules);

  return fromJS(Object.keys(queryParams).length ? queryParams : filters).merge(metadata)
}
