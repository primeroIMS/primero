// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import first from "lodash/first";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";

import sortWithSortedArray from "./sort-with-sorted-array";
import buildSingleRows from "./build-single-rows";
import buildGroupedRows from "./build-grouped-rows";

export default {
  ghn_report: ({ data, getLookupValue, key }) => {
    const grouped = data.some(fs => fs.get("group_id"));

    if (data === 0) return [];

    if (grouped) {
      return buildGroupedRows({ data, key, getLookupValue, groupedBy: "year" });
    }

    return buildSingleRows({ data, getLookupValue, key });
  },
  default: ({
    getLookupValue,
    data,
    key,
    isGrouped,
    groupedBy,
    ageRanges,
    lookupValues,
    incompleteDataLabel,
    totalText,
    subColumnItems = [],
    indicatorRows,
    includeZeros = false
  }) => {
    if (data === 0) return [];

    const lookupDisplayTexts = lookupValues?.map(lookupValue => lookupValue.display_text) || [];

    const indicatorRowDisplaytexts = indicatorRows?.map(row => row.display_text) || [];

    const sortByFn = elem => first(elem.row);

    let rowTitles = [];

    if (includeZeros) {
      rowTitles = !isEmpty(lookupDisplayTexts) ? lookupDisplayTexts : indicatorRowDisplaytexts;
    }

    const separators = indicatorRows?.reduce((acc, elem) => {
      if (elem.separator) {
        return [...acc, elem.display_text];
      }

      return acc;
    }, []);

    const generatedRows =
      isGrouped && groupedBy
        ? buildGroupedRows({ data, key, getLookupValue, groupedBy, subColumnItems, rowTitles })
        : buildSingleRows({ data, getLookupValue, key, subColumnItems, rowTitles });

    const rows = generatedRows.map(current => ({ ...current, separator: separators?.includes(current.row[0]) }));

    if (!isEmpty(lookupDisplayTexts)) {
      const sortArray = [...lookupDisplayTexts, incompleteDataLabel, totalText];

      return sortWithSortedArray(rows, sortArray, sortByFn);
    }

    if (!isEmpty(indicatorRowDisplaytexts)) {
      const sortArray = [...indicatorRowDisplaytexts, incompleteDataLabel, totalText];

      return sortWithSortedArray(rows, sortArray, sortByFn);
    }

    if (key === "age" || key?.includes("_age")) {
      const sortArray = [...ageRanges, incompleteDataLabel, totalText];

      return sortWithSortedArray(rows, sortArray, sortByFn);
    }

    return sortBy(rows, row => first(row.row));
  }
};
