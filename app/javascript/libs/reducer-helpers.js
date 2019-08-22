import { fromJS, List } from "immutable";
import mapValues from "lodash/mapValues";

export const mapEntriesToRecord = (entries, record) => {
  return fromJS(mapValues(entries, entry => record(entry)));
};

export const listEntriesToRecord = (entries, record) => {
  return List(entries.map(entry => record(entry)));
};
