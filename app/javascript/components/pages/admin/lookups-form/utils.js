import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import { dataToJS } from "../../../../libs";

export const validations = i18n =>
  object().shape({
    name: string()
      .required()
      .label(i18n.t("form_section.required_field", { field: "English Text" }))
  });

export const getInitialNames = (locales, name) => {
  if (isEmpty(name)) {
    return {};
  }

  return locales.reduce((acumulator, locale) => {
    return { ...acumulator, [locale]: name[locale] };
  }, {});
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
