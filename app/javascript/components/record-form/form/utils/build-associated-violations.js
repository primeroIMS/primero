// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../../../config";

export default (fieldName, values) => {
  if (
    !["individual_victims", "responses"].includes(fieldName) ||
    (isEmpty(values?.violation_category) && isEmpty(values?.type))
  ) {
    return null;
  }

  if (!isEmpty(values?.violation_category)) {
    return values?.violation_category.reduce((acc, violation) => {
      if (!values[violation]?.length) return acc;

      return { ...acc, [violation]: values[violation].map(val => val.unique_id) };
    }, {});
  }

  if (!isEmpty(values?.type) && VIOLATIONS_SUBFORM_UNIQUE_IDS.includes(values?.type)) {
    return { [values?.type]: [values?.unique_id] };
  }

  return null;
};
