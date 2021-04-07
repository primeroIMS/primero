/* eslint-disable import/prefer-default-export */

import { Map, List } from "immutable";

export const reduceMapToObject = data => {
  if (data && (data?.length || data?.size) <= 0) {
    return {};
  }

  if (Object.keys(data).length > 0 && (!(data instanceof Map) || !(data instanceof List))) {
    return data;
  }

  return data.reduce((accumulator, current, key) => {
    let value = current;

    if (current instanceof List) {
      value = current.reduce((acc, curr) => [...acc, curr], []);
    } else if (current instanceof Map) {
      value = current.reduce((acc, curr, k) => ({ ...acc, [k]: curr }), {});
    }

    return { ...accumulator, [key]: value };
  }, {});
};
