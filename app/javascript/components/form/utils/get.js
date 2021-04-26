/* eslint-disable import/prefer-default-export */
import { isImmutable } from "immutable";
import getProperty from "lodash/get";

export const get = (object, key, defaultValue) => {
  if (isImmutable(object)) {
    return object[Array.isArray(key) ? "getIn" : "get"](key, defaultValue);
  }

  return getProperty(object, key, defaultValue);
};
