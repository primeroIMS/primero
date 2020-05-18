import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD
} from "../../../../../../../form";

export const generalFields = (fieldName, i18n) => ({
  displayName: FieldRecord({
    display_name: i18n.t("fields.name"),
    name: `${fieldName}.display_name.en`,
    type: TEXT_FIELD,
    required: true,
    help_text: i18n.t("fields.must_be_english"),
    hint: `${i18n.t("fields.db_name")}: ${fieldName}`
  }),
  helpText: FieldRecord({
    display_name: i18n.t("fields.help_text"),
    name: `${fieldName}.help_text.en`,
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english")
  }),
  required: FieldRecord({
    display_name: i18n.t("fields.required"),
    name: `${fieldName}.required`,
    type: TICK_FIELD,
    required: true
  })
});

export const generalForm = (fieldName, i18n, fields = []) =>
  FormSectionRecord({
    unique_id: "field_form",
    fields: fields.length
      ? fields
      : Object.values(generalFields(fieldName, i18n))
  });
