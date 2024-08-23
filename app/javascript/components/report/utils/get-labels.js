// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { REPORT_FIELD_TYPES } from "../../reports-form/constants";

import formattedDate from "./formatted-date";
import getTranslatedKey from "./get-translated-key";
import sortDataKeys from "./sort-data-keys";

export default (data, i18n, fields, { agencies, ageRanges, locations }) => {
  const field = fields.find(reportField => reportField.position.type === REPORT_FIELD_TYPES.horizontal);
  const optionLabels = field?.option_labels?.[i18n.locale]?.map(option => option.display_text);
  const keys = sortDataKeys(Object.keys(data), { ageRanges, optionLabels });

  return keys.map(key => formattedDate(getTranslatedKey(key, field, { agencies, i18n, locations }), i18n));
};
