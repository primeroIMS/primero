import find from "lodash/find";

import { CUSTOM_STRINGS_SOURCE } from "../constants";

import getTranslatedText from "./get-translated-text";

export default ({ agencies, customLookups, i18n, option, options, value }) => {
  const foundOptions = find(options, { id: value }) || {};
  let optionValue = [];

  if (Object.keys(foundOptions).length && !customLookups.includes(option)) {
    optionValue = getTranslatedText(foundOptions.display_text, i18n);
  } else if (option === CUSTOM_STRINGS_SOURCE.agency) {
    optionValue = value ? agencies.find(a => a.get("id") === value)?.get("name") : value;
  } else {
    optionValue = "";
  }

  return optionValue;
};
