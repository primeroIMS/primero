import { fromJS } from "immutable";
import mapValues from "lodash/mapValues";

export const mapEntriesToRecord = (entries, record) => {
  return fromJS(mapValues(entries, entry => record(entry)));
};
