import { fromJS } from "immutable";

import { RECORD_TYPES_PLURAL } from "../../config";

import { FILTER_CATEGORY, INDIVIDUAL_VICTIM_FILTER_NAMES } from "./constants";

export const getFiltersByRecordType = (state, recordType, filterCategory) => {
  const filters = state.getIn(["user", "filters", recordType], fromJS([]));

  if (recordType === RECORD_TYPES_PLURAL.incident) {
    if (filterCategory === FILTER_CATEGORY.individual_victims) {
      return filters.filter(filter => INDIVIDUAL_VICTIM_FILTER_NAMES.includes(filter.field_name));
    }

    if (filterCategory === FILTER_CATEGORY.incidents) {
      return filters.filter(filter => !INDIVIDUAL_VICTIM_FILTER_NAMES.includes(filter.field_name));
    }
  }

  return filters;
};

export const getFiltersValuesByRecordType = (state, recordType) => {
  return state.getIn(["records", recordType, "filters"], fromJS({}));
};

export const getFiltersValueByRecordType = (state, recordType, key) => {
  return getFiltersValuesByRecordType(state, recordType).get(key, null);
};
