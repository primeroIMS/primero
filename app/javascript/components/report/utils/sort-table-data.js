import { sortWithSortedArray } from "../../insights-sub-report/utils";

import sortByDate from "./sort-by-date";

export default ({ field, data, sortByFn, ageRanges, groupAges, incompleteDataLabel, locale }) => {
  if (field.name.startsWith("age") && groupAges) {
    return sortWithSortedArray(data, ageRanges, sortByFn, incompleteDataLabel);
  }
  if (field.option_labels) {
    return sortWithSortedArray(
      data,
      field.option_labels[locale].map(option => option.display_text),
      sortByFn,
      incompleteDataLabel
    );
  }

  return sortByDate(sortWithSortedArray(data, data, sortByFn, incompleteDataLabel), true);
};
