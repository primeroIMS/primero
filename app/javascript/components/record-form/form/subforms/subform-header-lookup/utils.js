// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

export const getMultiSelectValues = (values, source, locale) =>
  values
    .map(lookupValue => {
      const value = source.find(o => o.id === lookupValue);

      if (locale) {
        return value?.display_text?.[locale] || "";
      }

      return value?.display_text || "";
    })
    .join(", ");

export const buildAssociatedViolationsLabels = (associatedViolations, value) => {
  if (isEmpty(associatedViolations) || isEmpty(value)) {
    return null;
  }

  return Object.entries(associatedViolations).find(val => val[1].includes(value))?.[0];
};
