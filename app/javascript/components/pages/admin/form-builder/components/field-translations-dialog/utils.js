/* eslint-disable import/prefer-default-export */

import { Map, List } from "immutable";

export const reduceMapToObject = map => {
  if (map.size <= 0) {
    return {};
  }

  return map.reduce((accumulator, current, key) => {
    let value = current;

    if (current instanceof List) {
      value = current.reduce((acc, curr) => [...acc, curr], []);
    } else if (current instanceof Map) {
      value = current.reduce((acc, curr, k) => ({ ...acc, [k]: curr }), {});
    }

    return { ...accumulator, [key]: value };
  }, {});
};
