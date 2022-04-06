import take from "lodash/take";

import { CHART_COLORS, QUARTERS } from "../../../config/constants";

import translateMonth from "./translate-month";
import translateQuarter from "./translate-quarter";

export default ({ totalText, getLookupValue, localizeDate, value, valueKey }) => {
  if (!value) return {};

  const data = value?.map(val => val.get("total")).toArray();

  if (value.some(elem => elem.get("group_id"))) {
    const options = value.reduce(
      (acc1, group) =>
        group.get("data").reduce((acc2, option) => {
          if (!acc2[option.get("id")]) {
            return { ...acc2, [option.get("id")]: getLookupValue(valueKey, option) };
          }

          return acc2;
        }, acc1),
      {}
    );

    const ids = Object.keys(options);

    const translateGroup = groupId => {
      const [groupKey, year] = groupId.split("-");

      const translatedGroup = QUARTERS.includes(groupKey)
        ? translateQuarter(groupKey, localizeDate)
        : translateMonth(groupKey, localizeDate);

      return `${translatedGroup}-${year}`;
    };

    return {
      datasets: value
        .map((group, index) => ({
          label: translateGroup(group.get("group_id")),
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
  }

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
