/* eslint-disable camelcase */

import isEmpty from "lodash/isEmpty";
import max from "lodash/max";

export default (rows, translation, columns) => {
  const maxItems = max(rows.map(row => row.length));

  return rows.map(row => {
    // applyRowStyle only gets applied when there are not columns defined in the report
    const [key, applyRowStyle, ...rest] = row;

    const translatedKey =
      translation
        .reduce((acc, prev) => {
          if ("option_labels" in prev) {
            return [...acc, ...prev.option_labels.en];
          }

          return acc;
        }, [])
        .find(option => option.id === key)?.display_text || key;

    const result = {
      // eslint-disable-next-line no-nested-ternary
      colspan: maxItems === row.length ? (applyRowStyle && isEmpty(columns) ? 1 : 0) : maxItems - 2,
      row: [translatedKey, ...rest]
    };

    return result;
  });
};
