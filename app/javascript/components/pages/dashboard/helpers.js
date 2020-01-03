import first from "lodash/first";

import { dataToJS } from "../../../libs";

import { INDICATOR_NAMES } from "./constants";

const translateLabels = (keys, data) => {
  return keys
    .map(k => data.filter(d => d.id === k))
    .flat()
    .map(sorted => sorted.display_text);
};

const translateSingleLabel = (key, data) => {
  if (key === "") return key;

  return data.filter(d => d.id === key)[0].display_text;
};

const getFormattedList = (values, listKey) => {
  return values.map(r => {
    return Object.entries(r).reduce((acc, obj) => {
      const [key, val] = obj;

      return { ...acc, [key]: typeof val === "object" ? val[listKey] : val };
    }, {});
  });
};

export const getFirstIndicator = data => {
  const firstIndicatorName = first(Object.keys(data.indicators));

  return data.indicators[firstIndicatorName];
};

export const toData1D = (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    // TODO: A refactor might be needed.
    const indicatorData = result.indicators[INDICATOR_NAMES.WORKFLOW];
    const values = Object.values(indicatorData);

    return {
      labels: translateLabels(Object.keys(indicatorData), localeLabels),
      data: values.map(v => v.count),
      query: values.map(v => v.query)
    };
  }

  return result;
};

export const toListTable = (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    // TODO: A refactor might be needed.
    const indicatorData = result.indicators[INDICATOR_NAMES.WORKFLOW_TEAM];
    const columns = Object.keys(
      indicatorData[first(Object.keys(indicatorData))]
    )
      .sort()
      .reduce((acum, value) => {
        return [
          ...acum,
          { name: value, label: translateSingleLabel(value, localeLabels) }
        ];
      }, []);

    const { "": removed, ...rows } = indicatorData;

    const values = Object.entries(rows).reduce((acum, value) => {
      const [user, userValue] = value;
      const columnValues = columns.reduce((a, o) => {
        return {
          ...a,
          [o.name]: o.name === "" ? user : userValue[o.name]
        };
      }, []);

      return [...acum, columnValues];
    }, []);

    return {
      columns,
      data: getFormattedList(values, "count"),
      query: getFormattedList(values, "query")
    };
  }

  return result;
};
