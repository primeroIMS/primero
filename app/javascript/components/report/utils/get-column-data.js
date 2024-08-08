// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uniq from "lodash/uniq";
import get from "lodash/get";

import { REPORT_FIELD_TYPES } from "../../reports-form/constants";

import sortDataKeys from "./sort-data-keys";

export default (column, data, i18n, qtyRows, fields, { ageRanges }) => {
  const totalLabel = i18n.t("report.total");
  const field = fields.find(reportField => reportField.position.type === REPORT_FIELD_TYPES.horizontal);
  const optionLabels = field?.option_labels?.[i18n.locale]?.map(option => option.display_text) || [];
  const keys = sortDataKeys(Object.keys(data), { ageRanges, optionLabels });

  if (qtyRows >= 2) {
    const firstRow = keys;
    const secondRow = uniq(firstRow.flatMap(row => Object.keys(data[row]).filter(key => key !== totalLabel)));

    return keys.reduce((firstRowAccum, firstRowCurr) => {
      const secondRowAccum = secondRow
        .map(secondLevel => {
          return get(data, [firstRowCurr, secondLevel, column, totalLabel]) || 0;
        })
        .reduce((acc, curr) => acc + curr);

      return [...firstRowAccum, secondRowAccum];
    }, []);
  }

  return keys
    .filter(key => key !== totalLabel)
    .map(key => {
      if (data[key][column] && data[key][column][totalLabel]) {
        return data[key][column][totalLabel];
      }

      return 0;
    })
    .flat();
};
