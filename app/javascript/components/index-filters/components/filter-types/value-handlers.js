// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { endOfDay, subMonths } from "date-fns";
import omit from "lodash/omit";

import { toServerDateFormat } from "../../../../libs";

import { ageParser } from "./utils";

const CUSTOM_FILTERS = {
  LAST_UPDATED_AT: "last_updated_at",
  MY_CASES: "my_cases"
};

const valueGetters = {
  age: value => ageParser(value),
  individual_age: value => ageParser(value)
};

const customCheckBoxFilters = {
  [CUSTOM_FILTERS.LAST_UPDATED_AT]: ({ fieldName, i18n }) => ({
    options: [
      {
        id: `0000-01-01T00:00:00Z..${toServerDateFormat(subMonths(new Date(), 3), {
          includeTime: true,
          normalize: true,
          callback: endOfDay
        })}`,
        display_name: i18n.t("cases.filter_by.3month_inactivity")
      }
    ],
    fieldName
  }),
  [CUSTOM_FILTERS.MY_CASES]: ({ user, label }) => ({
    options: [
      {
        id: `owned_by=${user}`,
        key: "owned_by",
        display_name: label("my_cases", "cases.filter_by.my_cases")
      },
      {
        id: `assigned_user_names=${user}`,
        key: "assigned_user_names",
        display_name: label("referred_cases", "cases.filter_by.referred_cases")
      }
    ],
    isObject: true,
    fieldName: "or"
  })
};

const valueSetters = {
  basic: methods => {
    const { setInputValue, setValue, fieldName, value } = methods;

    setInputValue(value);
    setValue(fieldName, value);
  },
  checkboxes: methods => {
    const { event, setInputValue, setValue, fieldName, inputValue } = methods;

    const values = event.target.checked
      ? [...inputValue, event.target.value]
      : inputValue.filter(val => val !== event.target.value);

    setInputValue(values);
    setValue(fieldName, values);
  },
  objectCheckboxes: methods => {
    const { event, setInputValue, setValue, fieldName, inputValue } = methods;
    const parsedValue = event.target.value.split("=");
    const value = event.target.checked
      ? { ...inputValue, [parsedValue[0]]: parsedValue[1] }
      : omit(inputValue, [parsedValue[0]]);

    setInputValue(value);
    setValue(fieldName, value);
  }
};

const valueParser = (fieldName, value) => {
  const hasCustomGetter = valueGetters?.[fieldName];

  return hasCustomGetter ? valueGetters[fieldName](value) : value;
};

const handleFilterChange = methods => {
  const { type } = methods;

  valueSetters[type || "basic"](methods);
};

const getFilterProps = ({ filter, user, i18n, label }) => {
  const { field_name: fieldName, options, option_strings_source: optionStringsSource, isObject } = filter;

  switch (fieldName) {
    case CUSTOM_FILTERS.LAST_UPDATED_AT:
      return customCheckBoxFilters[CUSTOM_FILTERS.LAST_UPDATED_AT]({
        i18n,
        fieldName
      });
    case CUSTOM_FILTERS.MY_CASES:
      return customCheckBoxFilters[CUSTOM_FILTERS.MY_CASES]({ user, label });
    default:
      return { options, fieldName, optionStringsSource, isObject };
  }
};

export { valueParser, getFilterProps };
export default handleFilterChange;
