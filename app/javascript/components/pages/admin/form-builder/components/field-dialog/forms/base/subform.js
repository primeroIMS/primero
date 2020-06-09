import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD
} from "../../../../../../../form";

export const subformFields = i18n => ({
  name: FieldRecord({
    display_name: i18n.t("fields.subform_section.name"),
    name: "subform_section.name.en",
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english")
  }),
  description: FieldRecord({
    display_name: i18n.t("fields.subform_section.description"),
    name: "subform_section.description.en",
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english")
  }),
  subform_append_only: FieldRecord({
    display_name: i18n.t("fields.subform_section.subform_append_only"),
    name: "subform_section.subform_append_only",
    type: TICK_FIELD
  }),
  subform_prevent_item_removal: FieldRecord({
    display_name: i18n.t("fields.subform_section.subform_prevent_item_removal"),
    name: "subform_section.subform_prevent_item_removal",
    type: TICK_FIELD
  }),
  starts_with_one_entry: FieldRecord({
    display_name: i18n.t("fields.subform_section.starts_with_one_entry"),
    name: "subform_section.starts_with_one_entry",
    type: TICK_FIELD
  })
});

export const subform = (i18n, fields = []) =>
  FormSectionRecord({
    unique_id: "subform_field",
    fields: fields.length ? fields : Object.values(subformFields(i18n))
  });
