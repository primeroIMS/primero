// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { reduceMapToObject } from "../../../libs/component-helpers";
import { FILTERS_TO_SKIP } from "../constants";

const skipFilters = data =>
  Object.entries(data).reduce((acc, [key, value]) => {
    if (!FILTERS_TO_SKIP.includes(key)) {
      return { ...acc, [key]: value };
    }

    return acc;
  }, {});

export default (
  isShowPage,
  allCurrentRowsSelected,
  shortIds,
  appliedFilters,
  queryParams,
  record,
  allRecordsSelected
) => {
  let filters = {};
  const defaultFilters = {
    status: ["open"],
    record_state: ["true"]
  };

  if (isShowPage) {
    filters = { short_id: [record.get("short_id")] };
  } else {
    const applied = skipFilters(reduceMapToObject(appliedFilters) || {});
    const params = skipFilters(queryParams || {});

    if (!allRecordsSelected && (allCurrentRowsSelected || shortIds.length)) {
      filters = { short_id: shortIds };
    } else if (Object.keys(params).length || Object.keys(applied).length) {
      filters = { ...params, ...applied };
    } else {
      filters = defaultFilters;
    }
  }

  const { query, ...restFilters } = filters;

  const returnFilters = Object.keys(restFilters).length ? restFilters : { short_id: shortIds };

  if (!isEmpty(query)) {
    return { filters: returnFilters, query };
  }

  return {
    filters: returnFilters
  };
};
