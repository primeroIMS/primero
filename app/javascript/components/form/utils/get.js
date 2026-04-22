/* eslint-disable import/prefer-default-export */
import { isImmutable } from "immutable";
import getProperty from "lodash/get";

export const get = (object, key, defaultValue) => {
  if (isImmutable(object)) {
    const parsedKey = Array.isArray(key) ? key : key.split(".");

    return object.getIn(parsedKey, defaultValue);
  }

  return getProperty(object, key, defaultValue);
};
