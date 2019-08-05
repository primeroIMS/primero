const getColors = () => {
  return ["#e0dfd6", "#595951", "#bcbcab", "green", "red", "yellow", "blue"];
};
const getColorsByRange = length => {
  return getColors().slice(0, length);
};
const getColorsByIndex = index => {
  return getColors()[index];
};
const buildDataSet = values => {
  if (typeof values[0] === "object") {
    const keys = Object.values(values);
    const returnedKeys = Object.keys(values[0]);

    const formattedGrouped = returnedKeys.map((k, i) => {
      const temp = { label: k, backgroundColor: getColorsByIndex(i) };
      temp.data = keys.map(x => {
        return x[k] === 0 ? 0.1 : x[k];
      });
      return temp;
    });
    return formattedGrouped;
  }
  return [
    {
      label: "",
      data: values,
      backgroundColor: getColorsByRange(values.length)
    }
  ];
};
export const buildDataForReport = data => {
  if (data.size <= 0) {
    return {};
  }
  const formattedData = data.toJS();
  formattedData.data = {
    labels: Object.keys(formattedData.data),
    datasets: buildDataSet(Object.values(formattedData.data))
  };

  return formattedData;
};

export const buildDataForTable = data => {
  if (data.size <= 0) {
    return { columns: [], values: [] };
  }

  const formattedData = data.toJS();
  const entries = Object.entries(formattedData.data);
  const isObject = typeof entries[0][1] === "object";
  const columns = [
    formattedData.column_name,
    Object.keys(Object.values(formattedData.data)[0]),
    "TOTAL"
  ]
    .flat()
    .map(c => c.toUpperCase());

  let values = [];
  if (isObject) {
    values = entries.map(x => {
      const numericValues = Object.values(x[1]);
      return [
        x[0],
        numericValues,
        numericValues.reduce((acum, curr) => acum + curr, 0)
      ].flat();
    });
  } else {
    values = entries;
  }

  return { columns, values };
};
