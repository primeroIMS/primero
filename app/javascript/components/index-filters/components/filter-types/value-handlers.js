import { format, subMonths } from "date-fns";

import { ageParser } from "./utils";

const CUSTOM_FILTERS = {
  LAST_UPDATED_AT: "last_updated_at",
  MY_CASES: "my_cases"
};

const valueGetters = {
  age: value => ageParser(value)
};

const customCheckBoxFilters = {
  [CUSTOM_FILTERS.LAST_UPDATED_AT]: ({ fieldName, i18n }) => ({
    options: [
      {
        id: `01-Jan-0000.${format(subMonths(new Date(), 3), "dd-MMM-yyyy")}`,
        display_name: i18n.t("cases.filter_by.3month_inactivity")
      }
    ],
    fieldName
  }),
  [CUSTOM_FILTERS.MY_CASES]: ({ i18n, user }) => ({
    options: [
      {
        id: "owned_by",
        value: { owned_by: user },
        name: "my_cases[owned_by]",
        display_name: i18n.t("cases.filter_by.my_cases")
      },
      {
        id: "assigned_user_names",
        value: { assigned_user_names: user },
        name: "my_cases[assigned_user_names]",
        display_name: i18n.t("cases.filter_by.referred_cases")
      }
    ],
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
  }
};

const valueParser = (fieldName, value) => {
  const hasCustomGetter = valueGetters?.[fieldName];

  return hasCustomGetter ? valueGetters[fieldName](value) : value;
};

const handleFilterChange = methods => {
  const { type } = methods;

  valueSetters[type](methods);
};

const getFilterProps = ({ filter, user, i18n }) => {
  const {
    field_name: fieldName,
    options,
    option_strings_source: optionStringsSource
  } = filter;

  switch (fieldName) {
    case CUSTOM_FILTERS.LAST_UPDATED_AT:
      return customCheckBoxFilters[CUSTOM_FILTERS.LAST_UPDATED_AT]({
        i18n,
        fieldName
      });
    case CUSTOM_FILTERS.MY_CASES:
      return customCheckBoxFilters[CUSTOM_FILTERS.MY_CASES]({ i18n, user });
    default:
      return { options, fieldName, optionStringsSource };
  }
};

export { valueParser, getFilterProps };
export default handleFilterChange;
