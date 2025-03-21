// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FILTER_TYPES } from "../constants";
import {
  CheckboxFilter,
  ChipsFilter,
  SwitchFilter,
  DateFilter,
  ToggleFilter,
  SelectFilter,
  WorkflowFilter
} from "../components/filter-types";

export default type => {
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
    case FILTER_TYPES.WORKFLOW:
      return WorkflowFilter;
    default:
      return null;
  }
};
