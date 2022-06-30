import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

import { APPROVALS, APPROVALS_TYPES } from "../../config";

import { FILTER_TYPES, MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "./constants";
import {
  CheckboxFilter,
  ChipsFilter,
  SwitchFilter,
  DateFilter,
  ToggleFilter,
  SelectFilter
} from "./components/filter-types";

export const filterType = type => {
  switch (type) {
    case FILTER_TYPES.CHECKBOX:
      return CheckboxFilter;
    case FILTER_TYPES.TOGGLE:
      return SwitchFilter;
    case FILTER_TYPES.MULTI_TOGGLE:
      return ToggleFilter;
    case FILTER_TYPES.DATES:
      return DateFilter;
    case FILTER_TYPES.CHIPS:
      return ChipsFilter;
    case FILTER_TYPES.MULTI_SELECT:
      return SelectFilter;
    default:
      return null;
  }
};

export const compactFilters = values =>
  Object.keys(values).reduce((prev, current) => {
    const obj = prev;
    const value = values[current];

    if ((Array.isArray(value) || isObject(value)) && isEmpty(value)) {
      return obj;
    }

    if (value) {
      obj[current] = values[current];
    }

    return obj;
  }, {});

export const buildNameFilter = (item, i18n, approvalsLabels) => {
  switch (item) {
    case `${APPROVALS}.${APPROVALS_TYPES.assessment}`:
      return approvalsLabels.get("assessment");
    case `${APPROVALS}.${APPROVALS_TYPES.case_plan}`:
      return approvalsLabels.get("case_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.closure}`:
      return approvalsLabels.get("closure");
    case `${APPROVALS}.${APPROVALS_TYPES.action_plan}`:
      return approvalsLabels.get("action_plan");
    case `${APPROVALS}.${APPROVALS_TYPES.gbv_closure}`:
      return approvalsLabels.get("gbv_closure");
    default:
      return i18n.t(item);
  }
};

export const isDateFieldFromValue = (field, keys, locale) => {
  if (field.type !== "dates") {
    return false;
  }

  const datesOption = field?.options?.[locale];

  if (!datesOption) {
    return false;
  }

  return datesOption?.filter(dateOption => keys.includes(dateOption.id))?.length > 0;
};

export const showMyCasesFilter = (field, keys) =>
  field.field_name === MY_CASES_FILTER_NAME && keys.includes(OR_FILTER_NAME);

export const calculateFilters = ({
  defaultFilters,
  primaryFilters,
  defaultFilterNames,
  filters,
  locale,
  more,
  moreSectionKeys,
  queryParamsKeys
}) => {
  const selectedFromMoreSection = filters.filter(
    filter =>
      moreSectionKeys.includes(filter.field_name) ||
      showMyCasesFilter(filter, moreSectionKeys) ||
      isDateFieldFromValue(filter, moreSectionKeys, locale)
  );

  const queryParamsFilter = filters.filter(
    filter =>
      !more &&
      (queryParamsKeys.includes(filter.field_name) ||
        showMyCasesFilter(filter, queryParamsKeys) ||
        isDateFieldFromValue(filter, queryParamsKeys, locale)) &&
      !(
        defaultFilterNames.includes(filter.field_name) ||
        primaryFilters.map(t => t.field_name).includes(filter.field_name)
      )
  );

  return fromJS([
    ...primaryFilters,
    ...defaultFilters,
    ...queryParamsFilter,
    ...(!more ? selectedFromMoreSection : [])
  ]);
};
