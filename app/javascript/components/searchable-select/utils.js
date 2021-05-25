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
