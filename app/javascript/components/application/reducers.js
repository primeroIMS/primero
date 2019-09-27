import { Map, fromJS } from "immutable";
import { mapEntriesToRecord } from "libs";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";
import { PrimeroModuleRecord } from "./records";

const DEFAULT_STATE = Map({
  userIdle: false,
  online: window.navigator.onLine
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_SYSTEM_SETTINGS_SUCCESS: {
      const {
        agencies,
        modules,
        locales,
        default_locale: defaultLocale,
        base_language: baseLanguage,
        primero_version: primeroVersion
      } = payload;

      return state.merge(
        fromJS({
          agencies,
          modules: mapEntriesToRecord(modules, PrimeroModuleRecord),
          locales,
          defaultLocale,
          baseLanguage,
          primeroVersion
        })
      );
    }
    case Actions.SET_USER_IDLE:
      return state.set("userIdle", payload);
    case Actions.NETWORK_STATUS:
      return state.set("online", payload);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
