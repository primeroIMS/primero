import { VIOLATION_TALLY_FIELD } from "./constants";

export const getViolationTallyLabel = (fields, currentValues, locale) => {
  const displayText = fields.find(f => f.name === VIOLATION_TALLY_FIELD).display_name?.[locale];

  if (!currentValues.violation_tally) {
    return null;
  }

  return Object.entries(currentValues.violation_tally).reduce((acc, curr) => {
    if (curr[1] === 0 || curr[0] === "total") {
      return acc;
    }

    return `${acc} ${curr[0]}: (${curr[1]})`;
  }, `${displayText}:`);
};

export const getShortUniqueId = currentValues => {
  if (!currentValues.unique_id) return null;

  return currentValues.unique_id.substring(0, 5);
};

export const getVerifiedValue = (optionsStrings, currentValues) => {
  const { display_text: displayText } = optionsStrings.find(option => option.id === currentValues.verified) || {};

  return displayText;
};
