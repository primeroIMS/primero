import { createFilterOptions } from "@material-ui/lab/useAutocomplete";

export const optionLabel = (option, options, optionIdKey, optionLabelKey) => {
  if (typeof option === "string" && option === "") {
    return "";
  }

  const { [optionLabelKey]: label } =
    typeof option === "object" ? option : options?.find(opt => opt[optionIdKey] === option) || "";

  return label || "";
};

export const optionEquality = (option, selected, optionIdKey) => {
  return option?.[optionIdKey] === selected || option?.[optionIdKey] === selected?.[optionIdKey];
};

export const optionDisabled = option => option?.isDisabled || option?.disabled;

export const filterOptions = currentValue => {
  const defaultFilterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50
  });

  return (options, { inputValue, getOptionLabel }) => {
    const value = inputValue && currentValue && inputValue !== currentValue ? "" : inputValue;

    return defaultFilterOptions(options, { inputValue: value, getOptionLabel });
  };
};
