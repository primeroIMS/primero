import { dataToJS } from "../../../libs";

export const toData1D = data => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const values = Object.values(result.stats);

    return {
      labels: Object.keys(result.stats),
      data: values.map(v => v.count),
      query: values.map(v => v.query)
    };
  }

  return result;
};
