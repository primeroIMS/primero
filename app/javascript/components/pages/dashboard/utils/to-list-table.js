import first from "lodash/first";

import { dataToJS } from "../../../../libs";
import { INDICATOR_NAMES } from "../constants";

const translateSingleLabel = (key, data) => {
  if (key === "") return key;

  // eslint-disable-next-line camelcase
  return data?.filter(d => d.id === key)[0]?.display_text;
};
const getFormattedList = (values, listKey) => {
  return values.map(r => {
    return Object.entries(r).reduce((acc, obj) => {
      const [key, val] = obj;

      return { ...acc, [key]: typeof val === "object" ? val[listKey] : val };
    }, {});
  });
};

export default (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const indicatorData = result.indicators[INDICATOR_NAMES.WORKFLOW_TEAM];

    const columns = Object.keys(
      indicatorData[first(Object.keys(indicatorData))]
    )
      .reduce((acum, value) => {
        return [
          ...acum,
          { name: value, label: translateSingleLabel(value, localeLabels) }
        ];
      }, [])
      .filter(column => typeof column.label !== "undefined")
      .sort((a, b) => {
        const workflowOrder = localeLabels?.map(localeLabel => localeLabel.id);
        const indexa = workflowOrder.indexOf(a?.name);
        const indexb = workflowOrder.indexOf(b?.name);

        return indexa - indexb;
      });

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
