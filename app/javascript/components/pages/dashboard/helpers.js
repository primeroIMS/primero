import { dataToJS } from "../../../libs";

const translateLabels = (keys, data) => {
  return keys
    .map(k => data.filter(d => d.id === k))
    .flat()
    .map(sorted => sorted.display_text);
};

export const toData1D = (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const values = Object.values(result.stats);

    return {
      labels: translateLabels(Object.keys(result.stats), localeLabels),
      data: values.map(v => v.count),
      query: values.map(v => v.query)
    };
  }

  return result;
};
