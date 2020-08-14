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

const subformForms = ({ i18n, selectedLocaleId, cssHideField, cssTranslationField, locales, subform }) => {
  return [
    FormSectionRecord({
      unique_id: `subform_name`,
      name: i18n.t("form_section.name"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${subform.getIn(["name", "en"], "")}`,
          name: `subform_section.name.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
        })
      )
    }),
    FormSectionRecord({
      unique_id: `subform_description`,
      name: i18n.t("forms.form_description"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${subform.getIn(["description", "en"], "")}`,
          name: `subform_section.description.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
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
  subform
}) => {
  const displayNameForm = [
    FormSectionRecord({
      unique_id: `form_display_name`,
      name: i18n.t("fields.display_name"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${field.getIn(["display_name", "en"], "")}`,
          name: `${field.get("name")}.display_name.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
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
          display_name: `${i18n.t("home.en")}: ${field.getIn(["tick_box_label", "en"], "")}`,
          name: `${field.get("name")}.tick_box_label.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
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
          option_strings_text: locales.toJS(),
          disableClearable: true
        })
      ]
    }),
    ...(field.get("type") === SUBFORM_SECTION
      ? subformForms({
          i18n,
          selectedLocaleId,
          cssHideField,
          cssTranslationField,
          locales,
          subform
        })
      : displayNameForm),
    FormSectionRecord({
      unique_id: `form_help_text`,
      name: i18n.t("fields.help_text"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${field.getIn(["help_text", "en"], "")}`,
          name: `${field.get("name")}.help_text.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
        })
      )
    }),
    FormSectionRecord({
      unique_id: `form_guidance`,
      name: i18n.t("fields.guidance"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${field.getIn(["guiding_questions", "en"], "")}`,
          name: `${field.get("name")}.guiding_questions.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
        })
      )
    }),
    ...(field.get("type") === TICK_FIELD ? tickBoxForm : [])
  ];

  return fromJS(forms);
};
