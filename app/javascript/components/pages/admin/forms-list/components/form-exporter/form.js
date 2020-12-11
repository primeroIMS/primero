/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, RADIO_FIELD, TEXT_FIELD } from "../../../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "import_locations",
      fields: [
        FieldRecord({
          name: "visible",
          display_name: i18n.t("form_export.include_hidden"),
          type: RADIO_FIELD,
          option_strings_text: {
            [i18n.locale]: [
              {
                id: "false",
                label: i18n.t("true")
              },
              {
                id: "true",
                label: i18n.t("false")
              }
            ]
          }
        }),
        FieldRecord({
          name: "file_name",
          display_name: i18n.t("form_export.file_name"),
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
