/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "import_locations",
      fields: [
        FieldRecord({
          name: "file_name",
          display_name: i18n.t("form_export.file_name"),
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
