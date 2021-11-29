export const getShortUniqueId = currentValues => {
  if (!currentValues.unique_id) return null;

  return currentValues.unique_id.substring(0, 5);
};

export const getVerifiedValue = (optionsStrings, currentValues) => {
  const { display_text: displayText } = optionsStrings.find(option => option.id === currentValues.verified) || {};

  return displayText;
};
