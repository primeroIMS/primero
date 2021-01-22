import { fromJS, isCollection } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";

const getOptionText = ({ options, i18n, value }) => {
  const option = options.get("values", fromJS([])).find(optionValue => optionValue.get("id") === value);

  return option?.getIn(["display_text", i18n.locale], "") || value;
};

export const isTextField = field => [TEXT_FIELD, TEXT_AREA].includes(field.type);

export const getValueLabel = ({ options, i18n, value }) => {
  if (options) {
    return Array.isArray(value) || isCollection(value)
      ? value.map(current => getOptionText({ options, i18n, value: current })).join(", ")
      : getOptionText({ options, i18n, value });
  }

  return value;
};
