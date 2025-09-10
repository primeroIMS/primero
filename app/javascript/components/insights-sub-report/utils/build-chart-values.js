// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import take from "lodash/take";
import sortBy from "lodash/sortBy";
import first from "lodash/first";
import last from "lodash/last";
import isEmpty from "lodash/isEmpty";

import { CHART_COLORS } from "../../../config";

import translateGroup from "./translate-group-id";
import sortWithSortedArray from "./sort-with-sorted-array";
import groupIdComparator from "./group-id-comparator";

const sortTuples = ({ valueKey, tuples, ageRanges, lookupDisplayTexts, incompleteDataLabel }) => {
  const sortByFn = elem => first(elem);

  if (valueKey === "age") {
    return sortWithSortedArray(tuples, ageRanges, sortByFn, incompleteDataLabel);
  }

  if (lookupDisplayTexts.length > 1) {
    return sortWithSortedArray(tuples, lookupDisplayTexts, sortByFn, incompleteDataLabel);
  }

  return sortBy(tuples, sortByFn);
};

const sortEntries = ({
  valueKey,
  entries,
  ageRanges,
  lookupDisplayTexts,
  incompleteDataLabel,
  indicatorRowDisplaytexts
}) => {
  const sortByFn = ([, entryValue]) => entryValue;

  if (valueKey === "age" || valueKey.includes("_age")) {
    return sortWithSortedArray(entries, ageRanges, sortByFn, incompleteDataLabel);
  }

  if (lookupDisplayTexts.length > 1) {
    return sortWithSortedArray(entries, lookupDisplayTexts, sortByFn, incompleteDataLabel);
  }

  if (!isEmpty(indicatorRowDisplaytexts)) {
    return sortWithSortedArray(entries, indicatorRowDisplaytexts, sortByFn, incompleteDataLabel);
  }

  return sortBy(entries, sortByFn);
};

const buildGroupedChartValues = ({
  value,
  getLookupValue,
  valueKey,
  groupedBy,
  localizeDate,
  ageRanges,
  indicatorRowDisplaytexts,
  lookupDisplayTexts,
  incompleteDataLabel
}) => {
  const options = value
    .flatMap(elem => elem.get("data", fromJS([])))
    .reduce((acc, option) => {
      if (!acc[option.get("id")]) {
        return { ...acc, [option.get("id")]: getLookupValue(valueKey, option) };
      }

      return acc;
    }, {});

  const optionEntries = Object.entries(options);

  const ids = sortEntries({
    valueKey,
    entries: optionEntries,
    ageRanges,
    lookupDisplayTexts,
    incompleteDataLabel,
    indicatorRowDisplaytexts
  }).map(([key]) => key);

  const sortedData = value.sort(groupIdComparator(groupedBy));

  const sortedGroups = sortedData.reduce(
    (acc, group) => acc.concat(translateGroup(group.get("group_id"), groupedBy, localizeDate)),
    []
  );

  return {
    datasets: ids.map((id, index) => ({
      label: options[id],
      data: sortedData.reduce(
        (acc, groupData) =>
          acc.concat(
            groupData
              .get("data")
              .find(option => option.get("id") === id)
              ?.get("total") || 0
          ),
        []
      ),
      backgroundColor: Object.values(CHART_COLORS)[index]
    })),
    labels: sortedGroups
  };
};

export default ({
  totalText,
  getLookupValue,
  localizeDate,
  value,
  valueKey,
  isGrouped,
  groupedBy,
  ageRanges,
  lookupValues,
  incompleteDataLabel,
  indicatorRows
}) => {
  if (!value) return {};

  const lookupDisplayTexts = lookupValues?.map(lookupValue => lookupValue.display_text) || [];

  const indicatorRowDisplaytexts = indicatorRows?.map(row => row.display_text) || [];

  if (!isEmpty(lookupDisplayTexts)) {
    lookupDisplayTexts.push(incompleteDataLabel);
    lookupDisplayTexts.push(totalText);
  }

  if (isGrouped && groupedBy) {
    return buildGroupedChartValues({
      value,
      getLookupValue,
      valueKey,
      groupedBy,
      localizeDate,
      ageRanges,
      lookupDisplayTexts,
      incompleteDataLabel,
      indicatorRowDisplaytexts
    });
  }

  const tuples = value.reduce((acc, elem) => {
    return [...acc, [getLookupValue(valueKey, elem), elem.get("total")]];
  }, []);

  const sortedTuples = sortTuples({ valueKey, tuples, ageRanges, lookupDisplayTexts, incompleteDataLabel });

  return {
    datasets: [
      {
        label: totalText,
        data: sortedTuples.flatMap(elem => last(elem)),
        backgroundColor: take(Object.values(CHART_COLORS), sortedTuples.length)
      }
    ],
    labels: sortedTuples.flatMap(elem => first(elem))
  };
};
