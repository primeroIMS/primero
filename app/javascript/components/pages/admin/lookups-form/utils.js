import { fromJS } from "immutable";
import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  SELECT_FIELD
} from "../../../form";
import { dataToJS } from "../../../../libs";

export const validations = i18n =>
  object().shape({
    name: string()
      .required()
      .label(i18n.t("form_section.required_field", { field: "English Text" }))
  });

export const form = (i18n, options, hiddenClass) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "lookups",
      fields: [
        FieldRecord({
          display_name: "Languague",
          name: "options",
          type: SELECT_FIELD,
          option_strings_text: options,
          editable: !(options?.length === 1),
          disabled: options?.length === 1
        }),
        FieldRecord({
          display_name: "English Text",
          name: "name",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: "Translation Text",
          name: "translated_name",
          type: TEXT_FIELD,
          customClass: hiddenClass
        })
      ]
    })
  ]);
};

export const getInitialValues = (locales, values) => {
  if (isEmpty(values)) {
    return {};
  }

  return locales.reduce((acumulator, locale) => {
    const result = values.reduce(
      (acc, value) => ({ ...acc, [value.id]: value.display_text[locale] }),
      {}
    );

    return { ...acumulator, [locale]: result };
  }, {});
};

export const reorderValues = (items, startIndex, endIndex) => {
  const result = items;
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export const translateValues = (values, locale) => {
  const data = dataToJS(values);

  return data.reduce(
    (acc, curr) => {
      return [
        ...acc,

        { ...curr, display_text: curr.display_text[locale] || "" }
      ];
    },

    []
  );
};
