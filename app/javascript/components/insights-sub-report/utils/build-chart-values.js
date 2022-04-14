import { fromJS } from "immutable";
import take from "lodash/take";

import { CHART_COLORS } from "../../../config/constants";

import translateGroup from "./translate-group";

const buildGroupedChartValues = ({ value, getLookupValue, valueKey, groupedBy, localizeDate }) => {
  const options = value
    .flatMap(elem => elem.get("data", fromJS([])))
    .reduce((acc, option) => {
      if (!acc[option.get("id")]) {
        return { ...acc, [option.get("id")]: getLookupValue(valueKey, option) };
      }

      return acc;
    }, {});

  const ids = Object.keys(options);

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
    labels: Object.values(options)
  };
};

export default ({ totalText, getLookupValue, localizeDate, value, valueKey, isGrouped, groupedBy }) => {
  if (!value) return {};

  if (isGrouped && groupedBy) {
    return buildGroupedChartValues({ value, getLookupValue, valueKey, groupedBy, localizeDate });
  }

  const data = value?.map(val => val.get("total")).toArray();

  return {
    datasets: [
      {
        label: totalText,
        data,
        backgroundColor: take(Object.values(CHART_COLORS), data.length)
      }
    ],
    labels: value.map(val => getLookupValue(valueKey, val)).toArray()
  };
};
