/* eslint-disable import/prefer-default-export */

import { Map, List } from "immutable";

export const reduceMapToObject = data => {
  if (data && (data?.length || data?.size) <= 0) {
    return {};
  }

  return data
    .toSeq()
    .entrySeq()
    .reduce((accumulator, current) => {
      const [key, currValue] = current;
      let value = currValue;

      if (current instanceof List) {
        value = current.reduce((acc, curr) => [...acc, curr], []);
      } else if (current instanceof Map) {
        value = current.reduce((acc, curr, k) => ({ ...acc, [k]: curr }), {});
      }

      return { ...accumulator, [key]: value };
    }, {});
};
