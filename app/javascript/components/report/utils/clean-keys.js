import reject from "lodash/reject";
import isEmpty from "lodash/isEmpty";

import getAllKeysObject from "./get-all-keys-object";

export default (i18n, object, columns) => {
  const allKeys = getAllKeysObject(i18n, object);

  return reject(
    allKeys.map(r => {
      const splitted = r.split(".");

      const newSplitted = splitted.filter(s => splitted.length >= columns.length + 1 && s !== "_total");

      return newSplitted.join(".");
    }),
    isEmpty
  );
};
