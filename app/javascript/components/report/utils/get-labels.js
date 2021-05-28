import uniq from "lodash/uniq";

import containsColumns from "./contains-columns";
import formattedDate from "./formatted-date";
import getTranslatedKey from "./get-translated-key";
import sortByDate from "./sort-by-date";

const getLabels = (columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations }) => {
  const totalLabel = i18n.t("report.total");
  const currentLabels = [];
  const field = fields.shift();
  const keys = sortByDate(Object.keys(data));

  if (qtyRows >= 2 && qtyColumns > 0) {
    return keys;
  }

  keys.forEach(key => {
    if (containsColumns(columns, data[key], i18n)) {
      currentLabels.push(
        keys
          .map(current => {
            return formattedDate(current, i18n);
          })
          .filter(label => label !== totalLabel)
      );
    } else {
      currentLabels.concat(getLabels(columns, data[key], i18n, fields, qtyColumns, qtyRows, { agencies, locations }));
    }
  });

  return uniq(currentLabels.flat()).map(key =>
    getTranslatedKey(key, field, {
      agencies,
      locations
    })
  );
};

export default (columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations }) =>
  getLabels(columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations });
