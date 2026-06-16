import { dataToJS } from "../../../../libs";
import { INDICATOR_NAMES } from "../constants";

const translateLabels = (keys, data) => {
  if (!data?.length) {
    return {};
  }

  return (
    keys
      .map(k => data.filter(d => d.id === k))
      .flat()
      // eslint-disable-next-line camelcase
      .map(sorted => sorted?.display_text)
  );
};

export default (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
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
