// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DATE_FIELD_CUSTOM_VALUES } from "../constants";

export default (field, isSubmit) => {
  if (!field.selected_value) {
    return false;
  }

  const selectedValue = DATE_FIELD_CUSTOM_VALUES.selected_value;

  if (!isSubmit) {
    return field.date_include_time
      ? selectedValue.withTime[field.selected_value]
      : selectedValue.withoutTime[field.selected_value];
  }

  return Object.entries(field.date_include_time ? selectedValue.withTime : selectedValue.withoutTime).find(
    obj => obj[1] === Boolean(field.selected_value)
  )?.[0];
};
