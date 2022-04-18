import { fromJS } from "immutable";
import first from "lodash/first";

import formatAgeRange from "./format-age-range";

export default (rows, ageRanges) => {
  const formattedAgeRanges = (ageRanges || fromJS([])).map(range => formatAgeRange(range));

  return formattedAgeRanges.reduce((acc, range) => {
    const row = rows.find(r => first(r.row) === range);

    if (row) {
      return acc.concat(row);
    }

    return acc;
  }, []);
};
