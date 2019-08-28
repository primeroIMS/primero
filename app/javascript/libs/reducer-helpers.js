import { List, fromJS } from "immutable";
import mapValues from "lodash/mapValues";

export const mapEntriesToRecord = (entries, record) => {
  return Array.isArray(entries)
    ? List(entries.map(e => record(e)))
    : fromJS(mapValues(entries, e => record(e)));
};

export const mapObjectPropertiesToRecords = (entries, record) => {
  return Object.keys(entries).reduce((prev, value) => {
    const p = prev;
    p[value] = mapEntriesToRecord(entries[value], record);
    return p;
  }, {});
};

export const mapListToObject = (entries, key, val) => {
  return entries.reduce((prev, value) => {
    const p = prev;
    p[value[key]] = value[val];
    return p;
  }, {});
};

export const listEntriesToRecord = (entries, record) => {
  return List(entries.map(entry => record(entry)));
};
