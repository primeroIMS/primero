// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
import { fromJS } from "immutable";

import { DEFAULT_FILTERS } from "../constants";

const defaultFiltersConstant = (modules, userModules) => {
  if (modules?.size > 1) {
    return {
      ...DEFAULT_FILTERS,
      module_id: [...userModules?.map(m => m.get("unique_id"))]
    };
  }

  return DEFAULT_FILTERS;
};

export default ({ queryParams, metadata, modules, userModules }) => {
  const filters = defaultFiltersConstant(modules, userModules);

  return fromJS(Object.keys(queryParams).length ? queryParams : filters).merge(metadata);
};
