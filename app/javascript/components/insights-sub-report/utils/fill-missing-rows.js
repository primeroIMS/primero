import max from "lodash/max";

export default (rows, titles) => {
  const missingTitles = (titles || []).filter(title => !rows.some(row => row[0] === title));
  const rowLength = max(rows.map(row => row.length)) || 1;
  const rowValues = new Array(rowLength - 1).fill(0, 0, rowLength - 1);

  return rows.concat(missingTitles.map(title => [title].concat(rowValues)));
};
