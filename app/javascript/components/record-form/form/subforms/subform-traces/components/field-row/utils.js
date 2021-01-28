/* eslint-disable camelcase */
import { isCollection } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";
import { dataToJS } from "../../../../../../../libs";

export const getOptionText = ({ options, value }) => {
  const plainOptions = dataToJS(options);

  const option = plainOptions.find(optionValue => optionValue.id === value);

  return option?.display_text || value;
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
