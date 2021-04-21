import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_FIELD } from "../../form";

import { COMMON_FIELD_NAMES, OWNABLE_FIELD_NAMES } from "./constants";

export default (i18n, commonFields, miniFormFields) =>
  fromJS([
    FormSectionRecord({
      unique_id: "owner_info",
      fields: [
        {
          row: [
            FieldRecord({
              display_name: i18n.t("cases.case_worker_code"),
              name: OWNABLE_FIELD_NAMES.OWNED_BY,
              type: TEXT_FIELD
            }),
            FieldRecord({
              display_name: i18n.t("cases.agency"),
              name: OWNABLE_FIELD_NAMES.OWNED_BY_AGENCY,
              type: SELECT_FIELD,
              option_strings_source: OPTION_TYPES.AGENCY,
              option_strings_source_id_key: "unique_id"
            })
          ]
        }
      ]
    }),
    FormSectionRecord({
      unique_id: "full_name",
      fields: [{ row: [commonFields.get(COMMON_FIELD_NAMES.NAME)] }]
    }),
    FormSectionRecord({
      unique_id: "common",
      fields: [
        {
          row: [
            commonFields.get(COMMON_FIELD_NAMES.SEX),
            commonFields.get(COMMON_FIELD_NAMES.DATE_OF_BIRTH),
            commonFields.get(COMMON_FIELD_NAMES.AGE),
            commonFields.get(COMMON_FIELD_NAMES.ESTIMATED)
          ]
        }
      ]
    }),
    FormSectionRecord({
      unique_id: "mini_form",
      fields: miniFormFields.valueSeq()
    })
  ]);
