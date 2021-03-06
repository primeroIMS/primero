import { ORIENTATION } from "./constants";

/* eslint-disable import/prefer-default-export */
export const getLocaleDir = locale => {
  switch (locale) {
    case "ar":
    case "ar-LB":
    case "ku":
    case "zh":
    case "ar-SD":
    case "ar-JO":
    case "fa-AF":
    case "ps-AF":
      return ORIENTATION.rtl;
    default:
      return ORIENTATION.ltr;
  }
};
