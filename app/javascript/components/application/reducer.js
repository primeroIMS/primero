import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../libs";

import actions from "./actions";
import NAMESPACE from "./namespace";
import { PrimeroModuleRecord } from "./records";
import { DEMO } from "./constants";

const DEFAULT_STATE = fromJS({
  userIdle: false
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
        age_ranges: ageRanges,
        approvals_labels: approvalsLabels
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
          ageRanges,
          approvalsLabels
        })
      );
    }
    case actions.SET_USER_IDLE:
      return state.set("userIdle", payload);
    case "user/LOGOUT_SUCCESS":
      return state.get(DEMO) ? DEFAULT_STATE.merge({ demo: true }).toJS() : DEFAULT_STATE;
    case actions.FETCH_SYSTEM_PERMISSIONS_FAILURE:
      return state.set("errors", true);
    case actions.FETCH_SYSTEM_PERMISSIONS_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_SYSTEM_PERMISSIONS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_SYSTEM_PERMISSIONS_SUCCESS:
      return state.set("permissions", fromJS(payload.data));
    case actions.FETCH_USER_GROUPS_FAILURE:
      return state.set("errors", true);
    case actions.FETCH_USER_GROUPS_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_USER_GROUPS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_USER_GROUPS_SUCCESS:
      return state.set("userGroups", fromJS(payload.data));
    case actions.FETCH_ROLES_FAILURE:
    case actions.FETCH_MANAGED_ROLES_FAILURE:
      return state.set("errors", true);
    case actions.FETCH_ROLES_FINISHED:
    case actions.FETCH_MANAGED_ROLES_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_ROLES_STARTED:
    case actions.FETCH_MANAGED_ROLES_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_ROLES_SUCCESS:
      return state.set("roles", fromJS(payload.data));
    case actions.DISABLE_NAVIGATION:
      return state.set("disabledApplication", payload);
    case actions.FETCH_MANAGED_ROLES_SUCCESS:
      return state.set("managedRoles", fromJS(payload.data));
    case actions.FETCH_SANDBOX_UI_SUCCESS:
      return state.set(DEMO, fromJS(payload.data.sandbox_ui));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
