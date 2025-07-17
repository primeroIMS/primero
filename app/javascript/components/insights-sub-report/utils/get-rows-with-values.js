import isEmpty from "lodash/isEmpty";

import getSubcolumnValues from "./get-subcolumn-values";
import fillMissingRows from "./fill-missing-rows";

export default ({ data, key, getLookupValue, subColumnItems = [], rowTitles = [] }) => {
  const subcolumnValues = data
    .flatMap(value => getSubcolumnValues({ key, data: value.get("data"), getLookupValue, subColumnItems }))
    .toArray();

  if (isEmpty(rowTitles)) return subcolumnValues;

  return fillMissingRows(subcolumnValues, rowTitles);
};
