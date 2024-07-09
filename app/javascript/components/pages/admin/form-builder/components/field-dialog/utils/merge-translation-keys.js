// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import mergeWith from "lodash/mergeWith";

import { SUBFORM_TRANSLATABLE_OPTIONS, FIELD_TRANSLATABLE_OPTIONS, LOCALIZABLE_OPTIONS_FIELD_NAME } from "../constants";

export default (defaultValues, currValues, isSubform = false) => {
  if (!currValues || isEmpty(currValues)) {
    return defaultValues;
  }

  const mergeWithCondition = (a, b) => (isEmpty(b) ? a : b);
  const translatableOptions = isSubform ? SUBFORM_TRANSLATABLE_OPTIONS : FIELD_TRANSLATABLE_OPTIONS;

  return Object.entries(defaultValues).reduce((acc, curr) => {
    const [key, value] = curr;

    if (translatableOptions.includes(key) && !isEmpty(value)) {
      const mergedValues = mergeWith({}, value, currValues[key], mergeWithCondition);
      const newValue = Object.values(LOCALIZABLE_OPTIONS_FIELD_NAME).includes(key)
        ? Object.values(mergedValues)
        : mergedValues;

      return { ...acc, [key]: newValue };
    }

    return { ...acc, [key]: value };
  }, {});
};
