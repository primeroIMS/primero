/* eslint-disable camelcase */
import { isCollection } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";
import { get } from "../../../../../../form/utils";

export const getOptionText = ({ options, value }) =>
  get(
    options.find(option => get(option, "id") === value, null, {}),
    "display_text",
    value
  );

export const isTextField = field => [TEXT_FIELD, TEXT_AREA].includes(field.type);

export const getValueLabel = ({ options, value }) => {
  if (options) {
    return Array.isArray(value) || isCollection(value)
      ? value.map(current => getOptionText({ options, value: current })).join(", ")
      : getOptionText({ options, value });
  }

  return value;
};
