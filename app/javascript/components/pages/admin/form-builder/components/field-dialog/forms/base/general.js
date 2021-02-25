import { FieldRecord, FormSectionRecord, TEXT_FIELD, TICK_FIELD, TEXT_AREA } from "../../../../../../../form";

export const generalFields = ({ fieldName, formMode, i18n, limitedProductionSite }) => ({
  displayName: FieldRecord({
    display_name: i18n.t("fields.name"),
    name: `${fieldName}.display_name.en`,
    type: TEXT_FIELD,
    required: true,
    help_text: i18n.t("fields.must_be_english"),
    hint: formMode.get("isNew") ? "" : `${i18n.t("fields.db_name")}: ${fieldName}`,
    disabled: limitedProductionSite
  }),
  helpText: FieldRecord({
    display_name: i18n.t("fields.help_text"),
    name: `${fieldName}.help_text.en`,
    type: TEXT_AREA,
    help_text: i18n.t("fields.must_be_english"),
    disabled: limitedProductionSite
  }),
  guidingQuestions: FieldRecord({
    display_name: i18n.t("fields.guidance"),
    name: `${fieldName}.guiding_questions.en`,
    type: TEXT_AREA,
    help_text: i18n.t("fields.must_be_english"),
    disabled: limitedProductionSite
  }),
  required: FieldRecord({
    display_name: i18n.t("fields.required"),
    name: `${fieldName}.required`,
    type: TICK_FIELD,
    required: true,
    disabled: limitedProductionSite
  }),
  disabled: FieldRecord({
    display_name: i18n.t("fields.enabled_label"),
    name: `${fieldName}.disabled`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  })
});

export const generalForm = ({ fields = [], fieldName, formMode, i18n, onManageTranslations, limitedProductionSite }) =>
  FormSectionRecord({
    unique_id: "field_form",
    actions: formMode.get("isEdit")
      ? [
          {
            text: i18n.t("forms.translations.manage"),
            outlined: true,
            rest: { onClick: onManageTranslations }
          }
        ]
      : [],
    fields: fields.length ? fields : Object.values(generalFields({ fieldName, formMode, i18n, limitedProductionSite }))
  });
