// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { sortWithSortedArray } from "../../insights-sub-report/utils";
import { AGE_RANGE_PATTERN, DATE_PATTERN } from "../constants";

import sortByDate from "./sort-by-date";
import sortByAge from "./sort-by-age";

export default (keys, { ageRanges, optionLabels }) => {
  if (keys.some(key => key.match(new RegExp(DATE_PATTERN)))) {
    return sortByDate(keys);
  }

  if (keys.some(key => key.match(new RegExp(AGE_RANGE_PATTERN)))) {
    return sortWithSortedArray(keys, ageRanges);
  }

  if (optionLabels?.length) {
    return sortWithSortedArray(keys, optionLabels);
  }

  if (keys.some(key => key.match(/[0-9]+/))) {
    return sortByAge(keys);
  }

  return keys;
};
