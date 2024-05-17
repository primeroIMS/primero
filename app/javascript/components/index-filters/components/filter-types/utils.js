// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { AGE_MAX } from "../../../../config";

export const registerInput = ({
  register,
  name,
  ref,
  defaultValue,
  setInputValue,
  clearSecondaryInput,
  isMultiSelect,
  isLocation
}) => {
  return register(
    Object.defineProperty(
      {
        name
      },
      "value",
      {
        set(data) {
          const dataValue = data || defaultValue;

          if (isLocation) {
            const inputValue = isMultiSelect
              ? dataValue.map(current => (typeof current === "string" ? current.toUpperCase() : current))
              : dataValue.toUpperCase();

            setInputValue(inputValue);
          } else {
            setInputValue(dataValue);
          }

          // eslint-disable-next-line no-param-reassign
          ref.current = isMultiSelect && data ? data.map(value => value?.code || value?.id || value) : data;

          if (!data && clearSecondaryInput) {
            clearSecondaryInput();
          }
        },
        get() {
          return ref.current;
        }
      }
    )
  );
};

export const whichOptions = ({ optionStringsSource, options, i18n, lookups, transform }) => {
  if (optionStringsSource) {
    return lookups;
  }

  const optionsObj = Array.isArray(options) ? options : options?.[i18n.locale];

  if (transform) {
    return transform(optionsObj);
  }

  return optionsObj;
};

export const optionText = (option, i18n) => {
  const { display_text: displayText, display_name: displayName } = option;

  return displayText instanceof Object || displayName instanceof Object
    ? displayText?.[i18n.locale] || displayName?.[i18n.locale]
    : displayText || displayName;
};

export const ageParser = value => {
  if (value.includes(" - ")) {
    return value.replace(" - ", "..");
  }

  if (value.includes("+")) {
    return value.replace("+", `..${AGE_MAX}`);
  }

  return "";
};

export const handleMoreFiltersChange = (moreFilters, setMoreFilters, fieldName, values) => {
  setMoreFilters({
    ...moreFilters,
    [fieldName]: values
  });

  if ((Array.isArray(values) && !values?.length) || !values) {
    const { [fieldName]: deleted, ...rest } = moreFilters;

    setMoreFilters(rest);
  }
};

export const resetSecondaryFilter = (isSecondary, filterName, values, moreSectionFilters, setMoreSectionFilters) => {
  if (isSecondary && isEmpty(values)) {
    const { [filterName]: deleted, ...rest } = moreSectionFilters;

    setMoreSectionFilters(rest);
  }
};

export const setMoreFilterOnPrimarySection = (filters, name, setValues, values = null) => {
  const filtersKeys = Object.keys(filters);

  if (filtersKeys?.length && filtersKeys.includes(name)) {
    let value = filters[name];

    if (values) {
      value = values;
    }
    setValues(name, value);
  }
};
