// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map } from "immutable";

import { displayNameHelper } from "../../../../../../../libs";

import { VIOLATION_TALLY_FIELD } from "./constants";

// eslint-disable-next-line import/prefer-default-export
export const getViolationTallyLabel = (fields, currentValues, locale) => {
  const violationTallyField = fields.find(f => f.name === VIOLATION_TALLY_FIELD);
  const violationTallyValue = Map.isMap(currentValues)
    ? currentValues.get(VIOLATION_TALLY_FIELD).toJS()
    : currentValues.violation_tally;

  if (!violationTallyValue || !violationTallyField) {
    return null;
  }

  const displayText = displayNameHelper(violationTallyField?.display_name, locale);
  const tallyValues = violationTallyField.tally;

  return Object.entries(violationTallyValue).reduce((acc, curr) => {
    if (curr[1] === 0 || curr[0] === "total") {
      return acc;
    }

    const keyTranslated = displayNameHelper(tallyValues.find(tv => tv.id === curr[0])?.display_text, locale);

    if (!keyTranslated) {
      return acc;
    }

    return `${acc} ${keyTranslated}: (${curr[1]})`;
  }, `${displayText}:`);
};
