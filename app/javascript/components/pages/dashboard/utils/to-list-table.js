// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import first from "lodash/first";
import isUndefined from "lodash/isUndefined";
import last from "lodash/last";
import isPlainObject from "lodash/isPlainObject";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";

import { dataToJS, displayNameHelper } from "../../../../libs";

import defaultBodyRender from "./default-body-render";

const translateSingleLabel = (key, data, locale) => {
  if (key === "") return key;

  const displayText = data?.filter(d => d.id === key)[0]?.display_text;

  // eslint-disable-next-line camelcase
  return isPlainObject(displayText) ? displayNameHelper(displayText, locale) : displayText;
};
const getFormattedList = (values, listKey, sort) => {
  const formattedList = values.map(value => {
    return Object.entries(value).reduce((acc, obj) => {
      const [key, val] = obj;

      return { ...acc, [key]: typeof val === "object" ? val[listKey] : val };
    }, {});
  });

  return sort ? sortBy(formattedList, [elem => elem[""]]) : formattedList;
};

export default (data, columnLabels, rowLabels, locale, indicatorGetter) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const indicator = indicatorGetter ? indicatorGetter(result.indicators) : last(Object.values(result.indicators));
    const indicatorData = indicator[first(Object.keys(indicator))] || {};

    const columnKeys = Object.keys(indicatorData);
    const columns = [{ id: "", display_text: "" }, ...columnLabels]
      .reduce((acc, elem) => {
        if (columnKeys.includes(elem.id) || elem.id === "") {
          return [
            ...acc,
            {
              name: elem.id,
              label: translateSingleLabel(elem.id, columnLabels, locale),
              options: { customBodyRender: defaultBodyRender }
            }
          ];
        }

        return acc;
      }, [])
      .filter(column => !isUndefined(column.label));

    const { "": removed, ...rows } = indicator;

    const isRowLabelsEmpty = isEmpty(rowLabels);

    const sortedRows = isRowLabelsEmpty
      ? Object.entries(rows)
      : rowLabels.reduce((acc, elem) => {
          const elemId = elem.id.toLowerCase();

          if (!isNil(rows[elemId])) {
            return [...acc, [elem.display_text, rows[elemId]]];
          }

          return acc;
        }, []);

    const values = sortedRows.reduce((acum, elem) => {
      const [key, value] = elem;
      const columnValues = columns.reduce((acc, column) => {
        if (!isNil(value)) {
          return {
            ...acc,
            [column.name]: column.name === "" ? key : value[column.name]
          };
        }

        return acc;
      }, []);

      return [...acum, columnValues];
    }, []);

    return {
      columns,
      data: getFormattedList(values, "count", isRowLabelsEmpty),
      query: getFormattedList(values, "query", isRowLabelsEmpty)
    };
  }

  return result;
};
