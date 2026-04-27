/* eslint-disable no-undef */
import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TEXT_FIELD, SELECT_FIELD } from "../form";

import { LOCALE_ID } from "./constants";

export const validationSchema = i18n =>
  object().shape({
    locale_id: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("select_language")
        })
      )
  });

export const translationsForm = ({ i18n, locales, currentValues, selectedLocaleId }) =>
  fromJS([
    FormSectionRecord({
      unique_id: "edit_translations",
      fields: [
        FieldRecord({
          display_name: i18n.t("select_language"),
          name: LOCALE_ID,
          type: SELECT_FIELD,
          required: true,
          selected_value: selectedLocaleId,
          option_strings_text: locales,
          disableClearable: true
        })
      ]
    }),
    FormSectionRecord({
      unique_id: `translations_name`,
      name: i18n.t("name"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${currentValues.name?.en}`,
          name: `name.${locale.id}`,
          type: TEXT_FIELD,
          watchedInputs: LOCALE_ID,
          showIf: localeID => locale.id === localeID
        })
      )
    }),
    FormSectionRecord({
      unique_id: `translations_description`,
      name: i18n.t("description"),
      fields: locales.map(locale =>
        FieldRecord({
          display_name: `${i18n.t("home.en")}: ${currentValues.description?.en}`,
          name: `description.${locale.id}`,
          type: TEXT_FIELD,
          watchedInputs: LOCALE_ID,
          showIf: localeID => locale.id === localeID
        })
      )
    })
  ]);
