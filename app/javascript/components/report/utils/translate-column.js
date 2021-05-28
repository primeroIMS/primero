/* eslint-disable camelcase */

import findOptionLabel from "./find-option-label";

export default (column, value, locale = "en") => {
  if ("option_labels" in column) {
    return findOptionLabel(column.option_labels, value, locale)?.display_text || value;
  }

  return value;
};
