/* eslint-disable import/prefer-default-export */

export const optionText = (option = {}, locale = "en") => {
  const { display_text: displayText, display_name: displayName } = option;

  return (displayText instanceof Object || displayName instanceof Object) && locale
    ? displayText?.[locale] || displayName?.[locale]
    : displayText || displayName;
};
