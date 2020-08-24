/* eslint-disable import/prefer-default-export */
export const getLocaleDir = locale => {
  switch (locale) {
    case "ar":
    case "ar-LB":
    case "ku":
    case "zh":
      return "rtl";
    default:
      return "ltr";
  }
};
