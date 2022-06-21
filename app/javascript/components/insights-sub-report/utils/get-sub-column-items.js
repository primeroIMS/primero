import { INSIGHTS_WITH_SUBCOLUMNS_ITEMS } from "../constants";

export default (valueKey, subcolumnsLookups) => {
  if (!INSIGHTS_WITH_SUBCOLUMNS_ITEMS.includes(valueKey) || !subcolumnsLookups) {
    return null;
  }

  return subcolumnsLookups.map(item => item.id);
};
