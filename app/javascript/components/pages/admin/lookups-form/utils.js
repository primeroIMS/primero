import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

export const validations = i18n =>
  object().shape({
    name: object().shape({
      en: string().required().label(i18n.t("lookup.english_label"))
    })
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
