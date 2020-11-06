/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, LABEL_FIELD, DOCUMENT_FIELD } from "../../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "import_locations",
      fields: [
        FieldRecord({
          display_name: i18n.t("location.message"),
          name: "import_message",
          type: LABEL_FIELD
        }),
        FieldRecord({
          name: "data",
          type: DOCUMENT_FIELD
        })
      ]
    })
  ]);
};
