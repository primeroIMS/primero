import isEmpty from "lodash/isEmpty";

import { reduceMapToObject } from "../../../libs";

import getSubcolumnValues from "./get-subcolumn-values";
import fillMissingRows from "./fill-missing-rows";

export default ({ getLookupValue, data, key, subColumnItems = [], rowTitles = [] }) => {
  const subcolumnValues = reduceMapToObject(getSubcolumnValues({ key, data, getLookupValue, subColumnItems })) || [];

  const rows = isEmpty(rowTitles) ? subcolumnValues : fillMissingRows(subcolumnValues, rowTitles);

  return rows.reduce((memo, row) => [...memo, { colspan: 0, row }], []);
};
