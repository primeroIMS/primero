import isEmpty from "lodash/isEmpty";

import getSubcolumnValues from "./get-subcolumn-values";

export default ({ data, key, getLookupValue, subColumnItems, rowTitles }) => {
  const rowWithValues = data
    .flatMap(value => getSubcolumnValues({ key, data: value.get("data"), getLookupValue, subColumnItems }))
    .toArray();

  if (isEmpty(rowTitles)) return rowWithValues;

  const missingTitles = (rowTitles || []).filter(title => !rowWithValues.some(row => row[0] === title));
  const rowLength = rowWithValues[0]?.length || 1;
  const rowValues = new Array(rowLength - 1).fill(0, 0, rowLength - 1);

  return rowWithValues.concat(missingTitles.map(title => [title].concat(rowValues)));
};
