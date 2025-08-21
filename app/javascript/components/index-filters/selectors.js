// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";
import isEmpty from "lodash/isEmpty";

import { RECORD_TYPES_PLURAL } from "../../config";
import { selectUserModules, getExactSearchFields, getPhoneticSearchFields } from "../application/selectors";
import { getFieldByName } from "../record-form/selectors";

import transformFieldTooltips from "./utils/transform-field-tooltips";
import { FILTER_CATEGORY, INDIVIDUAL_VICTIM_FILTER_NAMES, VIOLATIONS_FILTER_NAMES } from "./constants";

const selectedFilters = (state, recordType) => {
  const filters = state.getIn(["user", "filters", recordType], List([]));

  if (recordType === RECORD_TYPES_PLURAL.case) {
    const moduleListFilters = selectUserModules(state)?.reduce((prev, current) => {
      const moduleFilters = current.getIn(["list_filters", recordType]);

      return moduleFilters ? prev.merge(moduleFilters) : prev;
    }, List());

    return moduleListFilters
      ? filters.filter(listFilter => moduleListFilters.includes(listFilter.get("unique_id")))
      : List();
  }

  return filters;
};

export const getFiltersByRecordType = (state, recordType, filterCategory) => {
  const filters = selectedFilters(state, recordType);

  if (recordType === RECORD_TYPES_PLURAL.incident) {
    if (filterCategory === FILTER_CATEGORY.individual_victims) {
      return filters.filter(filter => INDIVIDUAL_VICTIM_FILTER_NAMES.includes(filter.field_name));
    }

    if (filterCategory === FILTER_CATEGORY.violations) {
      return filters.filter(filter => VIOLATIONS_FILTER_NAMES.includes(filter.field_name));
    }

    if (filterCategory === FILTER_CATEGORY.incidents) {
      return filters.filter(
        filter =>
          !INDIVIDUAL_VICTIM_FILTER_NAMES.includes(filter.field_name) &&
          !VIOLATIONS_FILTER_NAMES.includes(filter.field_name)
      );
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

export const getTooltipFields = (state, recordType, isPhonetic) => {
  if (isEmpty(recordType)) return null;

  const userModuleList = [...selectUserModules(state)];
  const searchFieldsByRecord = isPhonetic
    ? getPhoneticSearchFields(state).get(recordType)
    : getExactSearchFields(state).get(recordType);

  const fieldsArray = searchFieldsByRecord ? [...searchFieldsByRecord] : [];

  return transformFieldTooltips(getFieldByName(state, fieldsArray, userModuleList, RECORD_TYPES_PLURAL[recordType]));
};
