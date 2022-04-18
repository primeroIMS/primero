import { fromJS } from "immutable";
import take from "lodash/take";
import sortBy from "lodash/sortBy";
import first from "lodash/first";
import last from "lodash/last";

import { CHART_COLORS } from "../../../config/constants";

import translateGroup from "./translate-group";
import formatAgeRange from "./format-age-range";

const buildGroupedChartValues = ({ value, getLookupValue, valueKey, groupedBy, localizeDate, ageRanges }) => {
  const options = value
    .flatMap(elem => elem.get("data", fromJS([])))
    .reduce((acc, option) => {
      if (!acc[option.get("id")]) {
        return { ...acc, [option.get("id")]: getLookupValue(valueKey, option) };
      }

      return acc;
    }, {});

  const formattedAgeRanges = (ageRanges || fromJS([])).map(range => formatAgeRange(range));

  const ids =
    valueKey !== "age"
      ? Object.keys(options).sort()
      : formattedAgeRanges.reduce((acc, range) => {
          const row = Object.keys(options).find(val => val === range);

          if (row) {
            return acc.concat(row);
          }

          return acc;
        }, []);

  return {
    datasets: value
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
      }))
      .toArray(),
    labels:
      valueKey !== "age"
        ? sortBy(Object.entries(options), entry => first(entry))
        : formattedAgeRanges.reduce((acc, range) => {
            const entryValue = last(Object.entries(options).find(([key]) => key === range));

            if (entryValue) {
              return acc.concat(entryValue);
            }

            return acc;
          }, [])
  };
};

export default ({ totalText, getLookupValue, localizeDate, value, valueKey, isGrouped, groupedBy, ageRanges }) => {
  if (!value) return {};

  if (isGrouped && groupedBy) {
    return buildGroupedChartValues({ value, getLookupValue, valueKey, groupedBy, localizeDate, ageRanges });
  }

  const formattedAgeRanges = (ageRanges || fromJS([])).map(range => formatAgeRange(range));

  const sortedData =
    valueKey !== "age"
      ? value.sortBy(val => val.get("id")).reduce((acc, elem) => acc.concat(elem), [])
      : formattedAgeRanges.reduce((acc, range) => {
          const row = value.find(val => val.get("id") === range);

          if (row) {
            return acc.concat(row);
          }

          return acc;
        }, []);

  const data = sortedData?.map(val => val.get("total"));

  return {
    datasets: [
      {
        label: totalText,
        data,
        backgroundColor: take(Object.values(CHART_COLORS), data.length)
      }
    ],
    labels: sortedData.map(val => getLookupValue(valueKey, val))
  };
};
