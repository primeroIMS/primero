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

const sortTuples = ({ valueKey, tuples, ageRanges, lookupDisplayTexts, labels }) => {
  const sortByFn = elem => first(elem);

  if (valueKey === "age") {
    return sortWithSortedArray(tuples, ageRanges, sortByFn, labels.incompleteData);
  }

  if (lookupDisplayTexts.length > 1) {
    return sortWithSortedArray(tuples, lookupDisplayTexts, sortByFn, labels.incompleteData);
  }

  return sortBy(tuples, sortByFn);
};

const sortEntries = ({ valueKey, entries, ageRanges, lookupDisplayTexts, labels, indicatorRowDisplaytexts }) => {
  const sortByFn = ([, entryValue]) => entryValue;

  if (valueKey === "age" || valueKey.includes("_age")) {
    return sortWithSortedArray(entries, ageRanges, sortByFn, labels.incompleteData);
  }

  if (lookupDisplayTexts.length > 1) {
    return sortWithSortedArray(entries, lookupDisplayTexts, sortByFn, labels.incompleteData);
  }

  if (!isEmpty(indicatorRowDisplaytexts)) {
    return sortWithSortedArray(entries, indicatorRowDisplaytexts, sortByFn, labels.incompleteData);
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
  labels
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
    labels,
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
  getLookupValue,
  labels,
  localizeDate,
  value,
  valueKey,
  isGrouped,
  groupedBy,
  ageRanges,
  lookupValues,
  indicatorRows
}) => {
  if (!value) return {};

  const lookupDisplayTexts = lookupValues?.map(lookupValue => lookupValue.display_text) || [];

  const indicatorRowDisplaytexts = indicatorRows?.map(row => row.display_text) || [];

  if (!isEmpty(lookupDisplayTexts)) {
    lookupDisplayTexts.push(labels.incompleteData);
    lookupDisplayTexts.push(labels.total);
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
      indicatorRowDisplaytexts,
      labels
    });
  }

  const tuples = value.reduce((acc, elem) => {
    return [...acc, [getLookupValue(valueKey, elem), elem.get("total")]];
  }, []);

  const sortedTuples = sortTuples({ valueKey, tuples, ageRanges, lookupDisplayTexts, labels });

  return {
    datasets: [
      {
        label: labels.total,
        data: sortedTuples.flatMap(elem => last(elem)),
        backgroundColor: take(Object.values(CHART_COLORS), sortedTuples.length)
      }
    ],
    labels: sortedTuples.flatMap(elem => first(elem))
  };
};
