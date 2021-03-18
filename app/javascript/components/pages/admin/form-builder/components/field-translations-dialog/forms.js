import { fromJS } from "immutable";
import { object, string } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD,
  SELECT_FIELD,
  SUBFORM_SECTION
} from "../../../../../form";

const subformForms = ({
  i18n,
  selectedLocaleId,
  cssHideField,
  cssTranslationField,
  locales,
  currentValues,
  subform,
  limitedProductionSite
}) => {
  const subformSection = currentValues[subform.get("unique_id")]
    ? fromJS({
        name: currentValues[subform.get("unique_id")].display_name,
        description: subform.get("description", fromJS({}))
      })
    : subform;

  const subformValues = currentValues.subform_section ? fromJS(currentValues.subform_section) : subformSection;
  const subformName = subformValues.getIn(["name", "en"], "");
  const subformDescription = subformValues.getIn(["description", "en"], "");

  return [
    FormSectionRecord({
      unique_id: `subform_name`,
      name: i18n.t("form_section.name"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${subformName}`,
          name: `subform_section.name.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    }),
    FormSectionRecord({
      unique_id: `subform_description`,
      name: i18n.t("forms.form_description"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${subformDescription}`,
          name: `subform_section.description.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    })
  ];
};

export const validationSchema = i18n =>
  object().shape({
    locale_id: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("forms.translations.select_language")
        })
      )
  });

export const translationsFieldForm = ({
  i18n,
  selectedLocaleId,
  cssHideField,
  cssTranslationField,
  locales,
  field,
  subform,
  currentValues,
  limitedProductionSite
}) => {
  const {
    display_name: displayName,
    help_text: helpText,
    guiding_questions: guidingQuestions,
    tick_box_label: tickBoxLabel
  } = currentValues[field.get("name")] || {};

  const fieldForms = [
    FormSectionRecord({
      unique_id: `form_display_name`,
      name: i18n.t("fields.display_name"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${displayName?.en || ""}`,
          name: `${field.get("name")}.display_name.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    }),
    FormSectionRecord({
      unique_id: `form_help_text`,
      name: i18n.t("fields.help_text"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${helpText?.en || ""}`,
          name: `${field.get("name")}.help_text.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    }),
    FormSectionRecord({
      unique_id: `form_guidance`,
      name: i18n.t("fields.guidance"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${guidingQuestions?.en || ""}`,
          name: `${field.get("name")}.guiding_questions.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    })
  ];

  const tickBoxForm = [
    FormSectionRecord({
      unique_id: `form_tick_box_label`,
      name: i18n.t("fields.tick_box_label"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${tickBoxLabel?.en || ""}`,
          name: `${field.get("name")}.tick_box_label.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField,
          disabled: limitedProductionSite
        })
      )
    })
  ];

  const forms = [
    FormSectionRecord({
      unique_id: "edit_translations",
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.translations.select_language"),
          name: "locale_id",
          type: SELECT_FIELD,
          required: true,
          selected_value: selectedLocaleId,
          option_strings_text: locales,
          disableClearable: true
        })
      ]
    }),
    ...(field.get("type") === SUBFORM_SECTION && subform?.toSeq()?.size
      ? subformForms({
          i18n,
          selectedLocaleId,
          cssHideField,
          cssTranslationField,
          locales,
          subform,
          currentValues,
          limitedProductionSite
        })
      : fieldForms),
    ...(field.get("type") === TICK_FIELD ? tickBoxForm : [])
  ];

  return fromJS(forms);
};
