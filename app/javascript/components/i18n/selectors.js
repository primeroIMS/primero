import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getLocale = state => {
  const defaultLocale = window.I18n.locale;

  return state.size
    ? state.getIn(["ui", "I18n", "locale"], defaultLocale) ||
        state.getIn(["application", "defaultLocale"], defaultLocale)
    : defaultLocale;
};

export const getLocales = state => state.getIn(["application", "primero", "locales"], fromJS([]));

export const getAppDirection = state => state.getIn(["ui", NAMESPACE, "dir"], "ltr");
