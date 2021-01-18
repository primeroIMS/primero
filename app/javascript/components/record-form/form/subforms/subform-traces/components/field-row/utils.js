import { fromJS } from "immutable";

import { TEXT_FIELD, TEXT_AREA } from "../../../../../../form";

export const isTextField = field => [TEXT_FIELD, TEXT_AREA].includes(field.type);

export const getValueLabel = ({ options, i18n, value }) => {
  if (options) {
    const option = options.get("values", fromJS([])).find(optionValue => optionValue.get("id") === value);

    return option?.getIn(["display_text", i18n.locale], "") || value;
  }

  return value;
};
