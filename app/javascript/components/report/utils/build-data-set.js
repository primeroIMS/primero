// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import first from "lodash/first";

import { REPORT_FIELD_TYPES } from "../../reports-form/constants";

import formattedDate from "./formatted-date";
import getColors from "./get-colors";
import getColumnData from "./get-column-data";
import getTranslatedKey from "./get-translated-key";
import sortDataKeys from "./sort-data-keys";

export default (columns, data, i18n, fields, qtyRows, { agencies, ageRanges, locations }) => {
  const totalLabel = i18n.t("report.total");
  const dataResults = [];
  const field =
    fields.length > 1
      ? fields.find(reportField => reportField.position.type === REPORT_FIELD_TYPES.vertical)
      : first(fields);

  const optionLabels = field.option_labels?.[i18n.locale]?.map(option => option.display_text);

  if (!isEmpty(columns)) {
    sortDataKeys(columns, { ageRanges, optionLabels }).forEach((column, index) => {
      const label = getTranslatedKey(column, field, { agencies, i18n, locations });

      dataResults.push({
        label: formattedDate(label, i18n),
        data: getColumnData(column, data, i18n, qtyRows, fields, { ageRanges }),
        backgroundColor: getColors(index)
      });
    });
  } else {
    dataResults.push({
      label: totalLabel,
      data: Object.keys(data).map(column => data[column][totalLabel]),
      backgroundColor: getColors(0)
    });
  }

  return dataResults;
};
