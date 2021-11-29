/* eslint-disable import/prefer-default-export */
export const getVerifiedValue = (optionsStrings, currentValues) => {
  const { display_text: displayText } = optionsStrings.find(option => option.id === currentValues.verified) || {};

  return displayText;
};
