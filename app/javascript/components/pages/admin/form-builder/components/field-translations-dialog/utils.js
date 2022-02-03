/* eslint-disable import/prefer-default-export */

import { Map, List, Record } from "immutable";

export const reduceMapToObject = data => {
  if (data && (data?.length || data?.size) <= 0) {
    return null;
  }

  if (data instanceof List) {
    return data.reduce((acc, curr) => [...acc, reduceMapToObject(curr)], []);
  }

  if (data instanceof Map) {
    return data.entrySeq().reduce((acc, [key, value]) => ({ ...acc, [key]: reduceMapToObject(value) }), {});
  }

  if (data instanceof Record) {
    return data
      .toSeq()
      .entrySeq()
      .reduce((acc, [key, value]) => ({ ...acc, [key]: reduceMapToObject(value) }), {});
  }

  return data;
};
