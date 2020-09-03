import { fromJS } from "immutable";

export const getLocale = state => {
  const defaultLocale = window.I18n.locale;

  return state.size
    ? state.getIn(["ui", "I18n", "locale"], defaultLocale) ||
        state.getIn(["application", "defaultLocale"], defaultLocale)
    : defaultLocale;
};

export const getLocales = state => state.getIn(["application", "locales"], fromJS([]));
