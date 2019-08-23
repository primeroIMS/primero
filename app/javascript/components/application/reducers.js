import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_SYSTEM_SETTINGS_SUCCESS:
      return state
        .set("agencies", payload.data.agencies)
        .set("modules", payload.data.modules)
        .set("locales", payload.data.locales)
        .set("default_locale", payload.data.default_locale)
        .set("base_language", payload.data.base_language)
        .set("primero_version", payload.data.primero_version);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
