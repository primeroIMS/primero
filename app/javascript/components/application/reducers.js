import { Map, fromJS } from "immutable";
import { mapEntriesToRecord } from "libs";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";
import { PrimeroModuleRecord } from "./records";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_SYSTEM_SETTINGS_SUCCESS: {
      const {
        agencies,
        modules,
        locales,
        default_locale: defualtLocale,
        base_language: baseLanguage,
        primero_version: primeroVersion
      } = payload.data;

      return state.merge(
        fromJS({
          agencies,
          modules: mapEntriesToRecord(modules, PrimeroModuleRecord),
          locales,
          defualtLocale,
          baseLanguage,
          primeroVersion
        })
      );
    }
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
