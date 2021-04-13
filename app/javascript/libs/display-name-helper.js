import { isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";

export default (name, currLocale) => {
  if (isEmpty(name)) {
    return "";
  }

  if (isImmutable(name)) {
    return isEmpty(name?.get(currLocale)) ? name?.get(window.I18n.defaultLocale) : name?.get(currLocale);
  }

  return isEmpty(name?.[currLocale]) ? name?.[window.I18n.defaultLocale] : name?.[currLocale];
};
