import { VIOLATION_TALLY_FIELD } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const getViolationTallyLabel = (fields, currentValues, locale) => {
  const violationTallyField = fields.find(f => f.name === VIOLATION_TALLY_FIELD);

  if (!currentValues.violation_tally || !violationTallyField) {
    return null;
  }

  const displayText = violationTallyField.display_name?.[locale];

  return Object.entries(currentValues.violation_tally).reduce((acc, curr) => {
    if (curr[1] === 0 || curr[0] === "total") {
      return acc;
    }

    return `${acc} ${curr[0]}: (${curr[1]})`;
  }, `${displayText}:`);
};
