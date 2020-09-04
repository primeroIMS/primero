/* eslint-disable import/prefer-default-export */

export const getMultiSelectValues = (values, source, locale) =>
  values
    .map(lookupValue => {
      const value = source.find(o => o.id === lookupValue);

      if (locale) {
        return value.display_text?.[locale] || "";
      }

      return value.display_text || "";
    })
    .join(", ");
