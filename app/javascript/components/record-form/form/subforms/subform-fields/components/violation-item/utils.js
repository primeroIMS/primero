import { displayNameHelper } from "../../../../../../../libs";

import { VIOLATION_TALLY_FIELD } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const getViolationTallyLabel = (fields, currentValues, locale) => {
  const violationTallyField = fields.find(f => f.name === VIOLATION_TALLY_FIELD);

  if (!currentValues.violation_tally || !violationTallyField) {
    return null;
  }

  const displayText = displayNameHelper(violationTallyField?.display_name, locale);
  const tallyValues = violationTallyField.tally;

  return Object.entries(currentValues.violation_tally).reduce((acc, [key, value]) => {
    if (value === 0 || key === "total") {
      return acc;
    }

    const keyTranslated = displayNameHelper(tallyValues.find(tv => tv.id === key)?.display_text, locale);

    if (!keyTranslated) {
      return acc;
    }

    return `${acc} ${keyTranslated}: (${value})`;
  }, `${displayText}:`);
};
