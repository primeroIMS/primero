/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD, SELECT_FIELD } from "../../../../../form";

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

export const translationsForm = ({ i18n, selectedLocaleId, cssHideField, cssTranslationField, locales, formSection }) =>
  fromJS([
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
    FormSectionRecord({
      unique_id: `form_title`,
      name: i18n.t("forms.form_title"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${formSection.getIn(["name", "en"])}`,
          name: `name.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
        })
      )
    }),
    FormSectionRecord({
      unique_id: `form_description`,
      name: i18n.t("forms.form_description"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${formSection.getIn(["description", "en"])}`,
          name: `description.${locale.get("id")}`,
          type: TEXT_FIELD,
          inputClassname: locale.get("id") !== selectedLocaleId ? cssHideField : cssTranslationField
        })
      )
    })
  ]);
