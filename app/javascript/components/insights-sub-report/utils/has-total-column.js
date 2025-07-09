import { fromJS, List } from "immutable";
import isNil from "lodash/isNil";

export default (isGrouped, indicatorData) => {
  if (isGrouped) {
    return indicatorData.some(
      elem => List.isList(elem.get("data")) && elem.get("data", fromJS([])).some(row => !isNil(row.get("total")))
    );
  }

  return indicatorData.some(row => !isNil(row.get("total")));
};
