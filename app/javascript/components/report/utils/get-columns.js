import uniq from "lodash/uniq";

import getFirstKeyValue from "./get-first-key-value";

export default (data, totalLabel, qtyColumns, qtyRows) => {
  const isNested = qtyRows >= 2 && qtyColumns > 0;

  return uniq(
    Object.values(data)
      .map(current => Object.keys(isNested ? getFirstKeyValue(current, totalLabel) : current))
      .flat()
  ).filter(key => key !== totalLabel);
};
