import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import { toIdentifier } from "../../../../libs";

import { TEMP_OPTION_ID } from "./components/form/constants";

const isNewOption = key => Boolean(key.match(new RegExp(`^${TEMP_OPTION_ID}_\\d+`, "g"))?.length > 0);

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
    const result = values.reduce((acc, value) => ({ ...acc, [value.id]: value.display_text[locale] }), {});

    return { ...acumulator, [locale]: result };
  }, {});
};

export const getDisabledInfo = values =>
  values.reduce(
    (acc, value) => ({
      ...acc,
      [value.get("id")]: !value.get("disabled")
    }),
    {}
  );

export const reorderValues = (items, startIndex, endIndex) => {
  const result = items;
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export const buildValues = (values, defaultLocale, disabledValues) => {
  const locales = Object.keys(values);
  const displayTextKeys = Object.keys(values[defaultLocale]);

  return displayTextKeys.map(key => {
    return {
      id: isNewOption(key) ? toIdentifier(values.en[key]) : key,
      disabled: !disabledValues[key],
      display_text: locales.reduce((acc, locale) => ({ ...acc, [locale]: values[locale][key] }), {})
    };
  });
};
