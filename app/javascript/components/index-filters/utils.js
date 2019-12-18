import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

import { FILTER_TYPES } from "./constants";
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
