/* eslint-disable camelcase */
import { isCollection, fromJS } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";

export const getOptionText = ({ options, value }) =>
  options.find(option => option.get("id") === value, null, fromJS({})).get("display_text", value);

export const isTextField = field => [TEXT_FIELD, TEXT_AREA].includes(field.type);

export const getValueLabel = ({ options, value }) => {
  if (options) {
    return Array.isArray(value) || isCollection(value)
      ? value.map(current => getOptionText({ options, value: current })).join(", ")
      : getOptionText({ options, value });
  }

  return value;
};
