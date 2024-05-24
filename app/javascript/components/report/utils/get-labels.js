// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    return keys.map(key =>
      getTranslatedKey(key, field, {
        agencies,
        i18n,
        locations
      })
    );
  }

  if (qtyColumns > 0) {
    keys.forEach(key => {
      if (containsColumns(columns, data[key], i18n)) {
        currentLabels.push(keys.map(current => formattedDate(current, i18n)).filter(label => label !== totalLabel));
      } else {
        currentLabels.concat(getLabels(columns, data[key], i18n, fields, qtyColumns, qtyRows, { agencies, locations }));
      }
    });
  } else {
    currentLabels.push(keys);
  }

  return uniq(currentLabels.flat()).map(key => {
    const translation = getTranslatedKey(key, field, {
      agencies,
      i18n,
      locations
    });

    return translation;
  });
};

export default (columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations }) =>
  getLabels(columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations });
