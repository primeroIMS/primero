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
        reporting_location_config: reportingLocationConfig,
        age_ranges: ageRanges
      } = payload;

      return state.merge(
        fromJS({
          agencies,
          modules: mapEntriesToRecord(modules, PrimeroModuleRecord),
          locales,
          defaultLocale,
          baseLanguage,
          primeroVersion,
          reportingLocationConfig,
          ageRanges
        })
      );
    }
    case actions.SET_USER_IDLE:
      return state.set("userIdle", payload);
    case actions.NETWORK_STATUS:
      return state.set("online", payload);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case actions.FETCH_SYSTEM_PERMISSIONS_FAILURE:
      return state.set("errors", true);
    case actions.FETCH_SYSTEM_PERMISSIONS_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_SYSTEM_PERMISSIONS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_SYSTEM_PERMISSIONS_SUCCESS:
      return state.set("permissions", fromJS(payload.data));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
