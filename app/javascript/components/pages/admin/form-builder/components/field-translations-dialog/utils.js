/* eslint-disable import/prefer-default-export */
import isEmpty from "lodash/isEmpty";

export const buildDefaultOptionStringsText = (optionStringsText, locales) => {
  if (isEmpty(optionStringsText)) {
    return {};
  }

  const optionIds = optionStringsText?.en.map(option => option.id) || [];

  return locales
    .map(locale => {
      const localeId = locale.get("id");

      return {
        [localeId]: optionIds.map(id => {
          const currentOption = (optionStringsText[localeId] || [])?.find(
            option => option.id === id
          );

          return currentOption || { id, display_text: "" };
        })
      };
    })
    .reduce((acc, current) => ({ ...acc, ...current }), {});
};
