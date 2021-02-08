import { Map } from "immutable";

import { SET_LOCALE, SET_USER_LOCALE } from "./actions";
import NAMESPACE from "./namespace";
import { getLocaleDir } from "./utils";

const DEFAULT_STATE = Map({
  locale: "en",
  dir: "ltr"
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_LOCALE:
      return state.set("locale", payload.locale).set("dir", payload.dir);
    case SET_USER_LOCALE: {
      const json = payload?.json;
      const userLocale = json?.data?.locale || json?.locale;

      window.I18n.locale = userLocale || state.get("locale");
      document.documentElement.lang = userLocale;

      return userLocale ? state.set("locale", userLocale).set("dir", getLocaleDir(userLocale)) : state;
    }
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
