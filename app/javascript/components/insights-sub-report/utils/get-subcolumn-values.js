import isObjectLike from "lodash/isObjectLike";
import { isImmutable } from "immutable";

import { reduceMapToObject } from "../../../libs";

export default ({ getLookupValue, key, data, subColumnItems }) =>
  data.map(dataElem => {
    const values = subColumnItems?.length
      ? subColumnItems.map(lkOrder => dataElem.get(isObjectLike(lkOrder) ? lkOrder.id : lkOrder) || 0)
      : [isImmutable(dataElem.get("total")) ? reduceMapToObject(dataElem.get("total")) : dataElem.get("total")];

    return [getLookupValue(key, dataElem), ...values];
  });
