/* eslint-disable import/prefer-default-export */

export const optionText = (option, locale) => {
  const { display_text: displayText, display_name: displayName } = option;

  return displayText instanceof Object || displayName instanceof Object
    ? displayText?.[locale] || displayName?.[locale]
    : displayText || displayName;
};
