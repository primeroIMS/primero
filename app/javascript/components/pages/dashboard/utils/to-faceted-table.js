import { reduceMapToObject } from "../../../../libs";
import { sortWithSortedArray } from "../../../insights-sub-report/utils";

const translateLabel = (key, lookup) => {
  if (!lookup?.length) {
    return key;
  }

  return lookup.find(d => d.id === key)?.display_text || key;
};

export default (data, totalLabel = "Total", lookup = [], indicator) => {
  if (!data.size) {
    return { columns: [], data: [], query: [] };
  }

  const result = reduceMapToObject(data);
  const indicatorData = result.indicators[indicator];

  const sortedKeys = sortWithSortedArray(
    Object.keys(indicatorData),
    lookup.map(value => value.id)
  );

  const tableProps = sortedKeys.reduce(
    (acc, elem) => ({
      data: [...acc.data, { "": translateLabel(elem, lookup), total: indicatorData[elem].count }],
      query: [...acc.query, { "": translateLabel(elem, lookup), total: indicatorData[elem].query }]
    }),
    { data: [], query: [] }
  );

  return {
    columns: [
      { label: "", name: "" },
      { label: totalLabel, name: "total" }
    ],
    ...tableProps
  };
};
