import { FieldRecord, FormSectionRecord, TEXT_FIELD, TICK_FIELD } from "../../../../../../../form";

export const subformFields = ({ i18n, limitedProductionSite }) => ({
  name: FieldRecord({
    display_name: i18n.t("fields.subform_section.name"),
    name: "subform_section.name.en",
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english"),
    disabled: limitedProductionSite
  }),
  description: FieldRecord({
    display_name: i18n.t("fields.subform_section.description"),
    name: "subform_section.description.en",
    type: TEXT_FIELD,
    help_text: i18n.t("fields.must_be_english"),
    disabled: limitedProductionSite
  }),
  subform_append_only: FieldRecord({
    display_name: i18n.t("fields.subform_section.subform_append_only"),
    name: "subform_section.subform_append_only",
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  subform_prevent_item_removal: FieldRecord({
    display_name: i18n.t("fields.subform_section.subform_prevent_item_removal"),
    name: "subform_section.subform_prevent_item_removal",
    type: TICK_FIELD,
    disabled: limitedProductionSite
  })
});

export const subform = ({ fields = [], i18n, limitedProductionSite }) =>
  FormSectionRecord({
    unique_id: "subform_field",
    fields: fields.length ? fields : Object.values(subformFields({ i18n, limitedProductionSite }))
  });
