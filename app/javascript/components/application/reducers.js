import { Map, fromJS } from "immutable";
import { mapEntriesToRecord } from "libs";
import * as actionsUsers from "components/user/actions";
import Actions from "./actions";
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
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case Actions.APP_SETTINGS_FETCHED:
      return state.set("appSettingsFetched", payload);
    case actionsUsers.Actions.FETCH_USER_DATA_SUCCESS:
      // the key has to be update only when FETCH_USER_DATA is successed
      return state.set("appSettingsFetched", true);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
