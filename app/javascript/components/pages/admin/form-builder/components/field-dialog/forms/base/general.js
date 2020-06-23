import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD
} from "../../../../../../../form";

export const generalFields = ({ fieldName, formMode, i18n }) => ({
  displayName: FieldRecord({
    display_name: i18n.t("fields.name"),
    name: `${fieldName}.display_name.en`,
    type: TEXT_FIELD,
    required: true,
    help_text: i18n.t("fields.must_be_english"),
    hint: formMode.get("isNew")
      ? ""
      : `${i18n.t("fields.db_name")}: ${fieldName}`
  }),
  helpText: FieldRecord({
    display_name: i18n.t("fields.help_text"),
    name: `${fieldName}.help_text.en`,
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english")
  }),
  guidingQuestions: FieldRecord({
    display_name: i18n.t("fields.guidance"),
    name: `${fieldName}.guiding_questions.en`,
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

export const generalForm = ({ fields = [], fieldName, formMode, i18n }) =>
  FormSectionRecord({
    unique_id: "field_form",
    fields: fields.length
      ? fields
      : Object.values(generalFields({ fieldName, formMode, i18n }))
  });
