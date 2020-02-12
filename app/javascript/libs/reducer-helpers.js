import { List, Map, OrderedMap, fromJS } from "immutable";
import { extend, mapValues } from "lodash";

export const namespaceActions = (namespace, keys) =>
  Object.freeze(
    keys.reduce((map, key) => extend(map, { [key]: `${namespace}/${key}` }), {})
  );

export const mapEntriesToRecord = (entries, record, ordered) => {
  const mapFunc = ordered ? OrderedMap : fromJS;

  return Array.isArray(entries)
    ? List(entries.map(e => record(e)))
    : mapFunc(mapValues(entries, e => record(e)));
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
  return List(entries?.map(entry => record(entry)) || []);
};

export const arrayToObject = (data, key = "id") => {
  return data.reduce((obj, item) => {
    const o = obj;

    o[item[key]] = item;

    return o;
  }, {});
};

export const mergeRecord = (record, payload) => {
  const reduceSubformToMap = (result, item) => {
    return result.set(item.get("unique_id"), item);
  };

  const mergeSubforms = (prev, next) => {
    return prev.merge(next);
  };

  return record.mergeWith((prev, next) => {
    // Merge subforms
    if (List.isList(next) && next.some(s => s instanceof Map)) {
      const prevSubforms = prev.reduce(reduceSubformToMap, Map());
      const nextSubforms = next.reduce(reduceSubformToMap, Map());

      return [...prevSubforms.mergeWith(mergeSubforms, nextSubforms).values()];
    }

    // Everything else
    return next;
  }, payload);
};
