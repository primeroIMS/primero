import { fromJS } from "immutable";
import take from "lodash/take";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import last from "lodash/last";

import { CHART_COLORS } from "../../../config/constants";
import { YEAR } from "../../insights/constants";

import getDataGroups from "./get-data-groups";
import translateGroup from "./translate-group";
import sortWithSortedArray from "./sort-with-sorted-array";
import yearComparator from "./year-comparator";
import getGroupComparator from "./get-group-comparator";

const sortTuples = ({ valueKey, tuples, ageRanges, lookupDisplayTexts }) => {
  const sortByFn = elem => first(elem);

  if (valueKey === "age") {
    return sortWithSortedArray(tuples, ageRanges, sortByFn);
  }

  if (!isEmpty(lookupDisplayTexts)) {
    return sortWithSortedArray(tuples, lookupDisplayTexts, sortByFn);
  }

  return sortBy(tuples, sortByFn);
};

const sortEntries = ({ valueKey, entries, ageRanges, lookupDisplayTexts }) => {
  const sortByFn = ([, entryValue]) => entryValue;

  if (valueKey === "age") {
    return sortWithSortedArray(entries, ageRanges, sortByFn);
  }

  if (!isEmpty(lookupDisplayTexts)) {
    return sortWithSortedArray(entries, lookupDisplayTexts, sortByFn);
  }

  return sortBy(entries, sortByFn);
};

const sortValues = ({ valueKey, entries, ageRanges, lookupDisplayTexts }) => {
  if (valueKey === "age") {
    return sortWithSortedArray(entries, ageRanges);
  }

  if (!isEmpty(lookupDisplayTexts)) {
    return sortWithSortedArray(entries, lookupDisplayTexts);
  }

  return entries.sort();
};

const buildGroupedChartValues = ({
  value,
  getLookupValue,
  valueKey,
  groupedBy,
  localizeDate,
  ageRanges,
  lookupDisplayTexts
}) => {
  const options = value
    .flatMap(elem => elem.get("data", fromJS([])))
    .reduce((acc, option) => {
      if (!acc[option.get("id")]) {
        return { ...acc, [option.get("id")]: getLookupValue(valueKey, option) };
      }

      return acc;
    }, {});

  const optionValues = Object.values(options);
  const optionEntries = Object.entries(options);

  const ids = sortEntries({ valueKey, entries: optionEntries, ageRanges, lookupDisplayTexts }).map(([key]) => key);

  const groups = getDataGroups(value, groupedBy);
  const groupComparator = getGroupComparator(groupedBy);

  const sortedGroups =
    groupedBy === YEAR
      ? groups.sort(yearComparator)
      : Object.keys(groups)
          .sort(yearComparator)
          .flatMap(year => groups[year].sort(groupComparator).map(group => `${year}-${group}`));

  const groupedData = value.groupBy(elem => elem.get("group_id").toString());

  return {
    datasets: sortedGroups
      .flatMap(groupId => groupedData.get(groupId).reduce((acc, elem) => acc.concat(elem), []))
      .map((group, index) => ({
        label: translateGroup(group.get("group_id"), groupedBy, localizeDate),
        data: ids.map(
          id =>
            group
              .get("data")
              .find(elem => elem.get("id") === id)
              ?.get("total") || 0
        ),
        backgroundColor: Object.values(CHART_COLORS)[index]
      })),
    labels: sortValues({ valueKey, entries: optionValues, ageRanges, lookupDisplayTexts })
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
  lookupValues
}) => {
  if (!value) return {};

  const lookupDisplayTexts = lookupValues?.map(lookupValue => lookupValue.display_text) || [];

  if (isGrouped && groupedBy) {
    return buildGroupedChartValues({
      value,
      getLookupValue,
      valueKey,
      groupedBy,
      localizeDate,
      ageRanges,
      lookupDisplayTexts
    });
  }

  const tuples = value.reduce((acc, elem) => {
    return [...acc, [getLookupValue(valueKey, elem), elem.get("total")]];
  }, []);

  const sortedTuples = sortTuples({ valueKey, tuples, ageRanges, lookupDisplayTexts });

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
