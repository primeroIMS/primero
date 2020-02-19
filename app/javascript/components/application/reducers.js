import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../libs";

import actions from "./actions";
import NAMESPACE from "./namespace";
import { PrimeroModuleRecord } from "./records";

const DEFAULT_STATE = fromJS({
  userIdle: false,
  online: window.navigator.onLine
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_SYSTEM_SETTINGS_SUCCESS: {
      const {
        agencies,
        modules,
        locales,
        default_locale: defaultLocale,
        base_language: baseLanguage,
        primero_version: primeroVersion,
        reporting_location_config: reportingLocationConfig
      } = payload;

      return state.merge(
        fromJS({
          agencies,
          modules: mapEntriesToRecord(modules, PrimeroModuleRecord),
          locales,
          defaultLocale,
          baseLanguage,
          primeroVersion,
          reportingLocationConfig
        })
      );
    }
    case actions.SET_USER_IDLE:
      return state.set("userIdle", payload);
    case actions.NETWORK_STATUS:
      return state.set("online", payload);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
