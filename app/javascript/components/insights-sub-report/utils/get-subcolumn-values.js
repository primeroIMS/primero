import isObjectLike from "lodash/isObjectLike";

export default ({ getLookupValue, key, data, subColumnItems }) =>
  data.map(dataElem => {
    const values = subColumnItems?.length
      ? subColumnItems.map(lkOrder => dataElem.get(isObjectLike(lkOrder) ? lkOrder.id : lkOrder) || 0)
      : [dataElem.get("total")];

    return [getLookupValue(key, dataElem), ...values];
  });
