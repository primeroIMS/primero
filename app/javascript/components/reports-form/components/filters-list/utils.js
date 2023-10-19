// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const getOptionSources = fields =>
  fields.reduce((acc, field) => {
    if (!field.option_strings_source) {
      return acc;
    }

    return { ...acc, [field.option_strings_source]: true };
  }, {});
