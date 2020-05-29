import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD,
  SUBFORM_SECTION
} from "../../../../../../../form";

const subformFields = (fieldName, i18n) => ({
  description: FieldRecord({
    display_name: i18n.t("fields.subform.description"),
    name: `${fieldName}.description.en`,
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english")
  }),
  subform_append_only: FieldRecord({
    display_name: i18n.t("fields.subform.subform_append_only"),
    name: `${fieldName}.subform_append_only`,
    type: TICK_FIELD
  }),
  subform_prevent_item_removal: FieldRecord({
    display_name: i18n.t("fields.subform.subform_prevent_item_removal"),
    name: `${fieldName}.subform_prevent_item_removal`,
    type: TICK_FIELD
  })
});

export const subformField = (fieldName, i18n) => ({
  display_name: FieldRecord({
    display_name: i18n.t("fields.subform.title"),
    name: `${fieldName}.display_name.en`,
    type: SUBFORM_SECTION,
    required: true,
    help_text: i18n.t("fields.must_be_english"),
    hint: `${i18n.t("fields.db_name")}: ${fieldName}`,
    subform_section_id: FormSectionRecord({
      unique_id: "field_form",
      fields: Object.values(subformFields(fieldName, i18n))
    })
  })
});

export const subform = (fieldName, i18n, fields = []) =>
  FormSectionRecord({
    unique_id: "field_form",
    fields: fields.length
      ? fields
      : Object.values(subformField(fieldName, i18n))
  });
