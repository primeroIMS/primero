import { fromJS } from "immutable";
import compact from "lodash/compact";

import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_FIELD } from "../../form";

import { COMMON_FIELD_NAMES, OWNABLE_FIELD_NAMES } from "./constants";

const commonFieldsForm = commonFields => {
  const miniFormFields = commonFields.filter(field => field.show_on_minify_form);

  return miniFormFields.isEmpty()
    ? []
    : [
        FormSectionRecord({
          unique_id: "common",
          fields: [
            {
              row: compact([
                miniFormFields.get(COMMON_FIELD_NAMES.SEX),
                miniFormFields.get(COMMON_FIELD_NAMES.DATE_OF_BIRTH),
                miniFormFields.get(COMMON_FIELD_NAMES.AGE),
                miniFormFields.get(COMMON_FIELD_NAMES.ESTIMATED)
              ])
            }
          ]
        })
      ];
};

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
    ...commonFieldsForm(commonFields),
    FormSectionRecord({
      unique_id: "mini_form",
      fields: miniFormFields.valueSeq()
    })
  ]);
