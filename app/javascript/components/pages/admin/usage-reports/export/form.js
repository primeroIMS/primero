/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD, DATE_FIELD } from "../../../../form";

export const form = fieldDisplayName => {
  return fromJS([
    FormSectionRecord({
      unique_id: "import_locations",
      fields: [
        FieldRecord({
          display_name: fieldDisplayName.fromDate,
          required: true,
          name: "fromDate",
          type: DATE_FIELD
        }),
        FieldRecord({
          display_name: fieldDisplayName.toDate,
          required: true,
          name: "toDate",
          type: DATE_FIELD
        }),
        FieldRecord({
          name: "file_name",
          display_name: fieldDisplayName.file_name,
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
