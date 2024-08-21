// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { sortWithSortedArray } from "../../insights-sub-report/utils";
import { DATE_PATTERN } from "../constants";

import sortByAge from "./sort-by-age";
import sortByDate from "./sort-by-date";

export default ({ field, data, sortByFn, ageRanges, groupAges, incompleteDataLabel, locale }) => {
  if (field.name.startsWith("age")) {
    if (groupAges) {
      return sortWithSortedArray(data, ageRanges, sortByFn, incompleteDataLabel);
    }

    return sortByAge(data, sortByFn);
  }
  if (field.option_labels) {
    return sortWithSortedArray(
      data,
      field.option_labels[locale].map(option => option.display_text),
      sortByFn,
      incompleteDataLabel
    );
  }

  if (data.some(elem => (sortByFn ? sortByFn(elem) : elem).match(new RegExp(DATE_PATTERN)))) {
    return sortByDate(sortWithSortedArray(data, data, sortByFn, incompleteDataLabel), true);
  }

  return sortWithSortedArray(data, data, sortByFn, incompleteDataLabel);
};
