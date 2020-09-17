/* eslint-disable import/prefer-default-export */

import { displayNameHelper } from "../../../../../libs";

export const getOptionName = (option, i18n) => {
  let name = "";

  ["display_name", "display_text", "name"].forEach(prop => {
    if (prop in option) {
      name = typeof option[prop] === "object" ? displayNameHelper(option[prop], i18n.locale) : option[prop];
    }
  });

  return name;
};
