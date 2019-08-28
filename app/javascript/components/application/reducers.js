import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_SYSTEM_SETTINGS_SUCCESS:
      return state
        .set("agencies", payload.agencies)
        .set("modules", payload.modules)
        .set("locales", payload.locales)
        .set("default_locale", payload.default_locale)
        .set("base_language", payload.base_language)
        .set("primero_version", payload.primero_version);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
