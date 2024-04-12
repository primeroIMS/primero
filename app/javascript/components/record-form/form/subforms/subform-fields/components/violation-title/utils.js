// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { VIOLATION_STATUS } from "./constants";

export const getVerifiedValue = (optionsStrings, currentValues) => {
  const { display_text: displayText } =
    optionsStrings.find(option => option.id === currentValues[VIOLATION_STATUS]) || {};

  return displayText;
};
