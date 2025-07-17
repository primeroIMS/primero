import isEmpty from "lodash/isEmpty";

export default ({ getLookupValue, data, key, subColumnItems = [] }) =>
  data
    .map(value => {
      const lookupValue = getLookupValue(key, value);
      const subcolumnValues = subColumnItems.map(subcolumn => value.get(subcolumn.id, 0));
      const totalValue = !isEmpty(subColumnItems) ? [] : [value.get("total")];

      return { colspan: 0, row: [lookupValue, ...subcolumnValues, ...totalValue] };
    })
    .toArray();
