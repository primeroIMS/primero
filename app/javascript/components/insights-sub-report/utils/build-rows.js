import first from "lodash/first";

export default ({ rowsWithValues, currentRows, columnIndex, columnsNumber }) => {
  const rows = [...currentRows];

  rowsWithValues.forEach(rowWithValues => {
    const [lookupValue, ...values] = rowWithValues;

    const existingIndex = rows.findIndex(elem => first(elem) === lookupValue);

    if (existingIndex !== -1) {
      rows[existingIndex] = [
        ...rows[existingIndex].slice(0, columnIndex),
        ...values,
        ...rows[existingIndex].slice(columnIndex + values.length)
      ];
    } else {
      const newRow = [lookupValue].concat(new Array(columnsNumber).fill(0, 0, columnsNumber));

      rows.push([...newRow.slice(0, columnIndex), ...values, ...newRow.slice(columnIndex + values.length)]);
    }
  });

  return rows;
};
