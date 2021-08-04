/* eslint-disable import/prefer-default-export */

export const getOptionSources = fields =>
  fields.reduce((acc, field) => {
    if (!field.option_strings_source) {
      return acc;
    }

    return { ...acc, [field.option_strings_source]: true };
  }, {});
