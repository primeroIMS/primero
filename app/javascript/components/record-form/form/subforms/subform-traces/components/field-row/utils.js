import { isCollection } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";

export const getOptionText = ({ options, value }) => {
  const option = options.find(optionValue => optionValue.get("id") === value);

  return option?.get("display_text") || value;
};

export const isTextField = field => [TEXT_FIELD, TEXT_AREA].includes(field.type);

export const getValueLabel = ({ options, value }) => {
  if (options) {
    return Array.isArray(value) || isCollection(value)
      ? value.map(current => getOptionText({ options, value: current })).join(", ")
      : getOptionText({ options, value });
  }

  return value;
};
