import isEmpty from "lodash";

import { AGE_MAX } from "../../../../config";

export const registerInput = ({
  register,
  name,
  ref,
  defaultValue,
  setInputValue,
  clearSecondaryInput,
  isMultiSelect
}) => {
  return register(
    Object.defineProperty(
      {
        name
      },
      "value",
      {
        set(data) {
          setInputValue(data || defaultValue);

          ref.current = isMultiSelect && data ? data.map(d => d.id) : data;

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

export const whichOptions = ({
  optionStringsSource,
  options,
  i18n,
  lookups
}) => {
  if (optionStringsSource) {
    return lookups;
  }

  return Array.isArray(options) ? options : options?.[i18n.locale];
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

export const handleMoreFiltersChange = (
  moreFilters,
  setMoreFilters,
  fieldName,
  values
) => {
  setMoreFilters({
    ...moreFilters,
    [fieldName]: values
  });

  if ((Array.isArray(values) && !values?.length) || !values) {
    const { [fieldName]: deleted, ...rest } = moreFilters;

    setMoreFilters(rest);
  }
};

export const resetSecondaryFilter = (
  isSecondary,
  filterName,
  values,
  moreSectionFilters,
  setMoreSectionFilters
) => {
  if (isSecondary && isEmpty(values)) {
    const { [filterName]: deleted, ...rest } = moreSectionFilters;

    setMoreSectionFilters(rest);
  }
};
