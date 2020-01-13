import { fromJS } from "immutable";

export const getLocale = state => {
  return state.length
    ? state.getIn(["ui", "I18n", "locale"]) ||
        state.getIn(["application", "defaultLocale"])
    : window.I18n.locale;
};

export const getLocales = state => {
  return state.getIn(["application", "locales"], fromJS([]));
};
