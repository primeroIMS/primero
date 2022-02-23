import sortBy from "lodash/sortBy";
import first from "lodash/first";
import isUndefined from "lodash/isUndefined";

import { dataToJS, displayNameHelper } from "../../../../libs";
import { INDICATOR_NAMES } from "../constants";

const translateSingleLabel = (key, data, locale) => {
  if (key === "") return key;

  // eslint-disable-next-line camelcase
  return displayNameHelper(data?.filter(d => d.id === key)[0]?.display_text, locale);
};
const getFormattedList = (values, listKey) => {
  const formattedList = sortBy(
    values.map(r => {
      return Object.entries(r).reduce((acc, obj) => {
        const [key, val] = obj;

        return { ...acc, [key]: typeof val === "object" ? val[listKey] : val };
      }, {});
    }),
    [elem => elem[""]]
  );

  return formattedList;
};

export default (data, localeLabels, locale) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const indicator = result.indicators[INDICATOR_NAMES.WORKFLOW_TEAM];
    const indicatorData = indicator[first(Object.keys(indicator))] || {};

    const columnKeys = Object.keys(indicatorData);
    const columns = (columnKeys.includes("") ? columnKeys : columnKeys.concat(""))
      .reduce((acum, value) => {
        return [...acum, { name: value, label: translateSingleLabel(value, localeLabels, locale) }];
      }, [])
      .filter(column => !isUndefined(column.label));

    const { "": removed, ...rows } = indicator;

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
      columns: sortBy(columns, item => {
        const labels = localeLabels.map(({ id }) => id);
        const index = labels.indexOf(item.name);

        if (item.name === "") {
          return -1;
        }

        if (!labels.includes(item.name)) {
          return 0;
        }

        return index + 1;
      }),
      data: getFormattedList(values, "count"),
      query: getFormattedList(values, "query")
    };
  }

  return result;
};
