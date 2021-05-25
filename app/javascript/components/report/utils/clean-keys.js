import reject from "lodash/reject";
import isEmpty from "lodash/isEmpty";

import { TOTAL_KEY } from "../constants";

import getAllKeysObject from "./get-all-keys-object";

export default (i18n, object, columns) => {
  const allKeys = getAllKeysObject(i18n, object);

  return reject(
    allKeys.map(key => {
      const splitted = key.split(".");

      const newSplitted = splitted.filter(value => splitted.length >= columns.length + 1 && value !== TOTAL_KEY);

      return newSplitted.join(".");
    }),
    isEmpty
  );
};
