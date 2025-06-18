// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import compact from "lodash/compact";

import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_FIELD } from "../../form";

import { COMMON_FIELD_NAMES, OWNABLE_FIELD_NAMES } from "./constants";

const selectedCommonFields = fields => [
  fields.get(COMMON_FIELD_NAMES.SEX),
  fields.get(COMMON_FIELD_NAMES.DATE_OF_BIRTH),
  fields.get(COMMON_FIELD_NAMES.AGE),
  fields.get(COMMON_FIELD_NAMES.ESTIMATED)
];

const commonFieldsForm = (commonFields, useRows = true) =>
  commonFields.isEmpty()
    ? []
    : [
        FormSectionRecord({
          unique_id: "common",
          fields: [useRows ? { row: compact(selectedCommonFields(commonFields)) } : selectedCommonFields]
        })
      ];

const ownerFields = ownershipDisplayNames => [
  FieldRecord({
    display_name: ownershipDisplayNames[OWNABLE_FIELD_NAMES.OWNED_BY],
    name: OWNABLE_FIELD_NAMES.OWNED_BY,
    type: TEXT_FIELD
  }),
  FieldRecord({
    display_name: ownershipDisplayNames[OWNABLE_FIELD_NAMES.OWNED_BY_AGENCY],
    name: OWNABLE_FIELD_NAMES.OWNED_BY_AGENCY,
    type: SELECT_FIELD,
    option_strings_source: OPTION_TYPES.AGENCY,
    option_strings_source_id_key: "unique_id"
  })
];

const commonNameFields = fields => (fields.get(COMMON_FIELD_NAMES.NAME) ? [fields.get(COMMON_FIELD_NAMES.NAME)] : []);

export default ({ ownershipDisplayNames = {}, commonFields, miniFormFields, useRows = true }) =>
  fromJS([
    FormSectionRecord({
      unique_id: "owner_info",
      fields: useRows ? [{ row: ownerFields(ownershipDisplayNames) }] : ownerFields(ownershipDisplayNames)
    }),
    FormSectionRecord({
      unique_id: "full_name",
      fields: useRows ? [{ row: commonNameFields(commonFields) }] : commonNameFields(commonFields)
    }),
    ...commonFieldsForm(commonFields, useRows),
    FormSectionRecord({
      unique_id: "mini_form",
      fields: miniFormFields.valueSeq()
    })
  ]);
