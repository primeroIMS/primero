/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD, DATE_FIELD } from "../../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "import_locations",
      fields: [
        FieldRecord({
          display_name: `${i18n.t("key_performance_indicators.date_range_dialog.from")}*`,
          name: "fromDate",
          type: DATE_FIELD,
          allowFullWidth: false
        }),
        FieldRecord({
          display_name: `${i18n.t("key_performance_indicators.date_range_dialog.to")}*`,
          name: "toDate",
          type: DATE_FIELD,
          allowFullWidth: false
        }),
        FieldRecord({
          name: "file_name",
          display_name: `${i18n.t("usage_report.file_name")}*`,
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
