export const optionLabel = (option, options) => {
  if (typeof option === "string" && option === "") {
    return "";
  }

  const { label } = typeof option === "object" ? option : options?.find(opt => opt.value === option) || "";

  return label || "";
};

export const optionEquality = (option, selected) => option?.value === selected || option?.value === selected?.value;

export const optionDisabled = option => option?.isDisabled;
