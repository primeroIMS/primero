// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../libs/reducer-helpers";

import actions from "./actions";
import NAMESPACE from "./namespace";
import { PrimeroModuleRecord } from "./records";

const DEFAULT_STATE = fromJS({
  userIdle: false
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_SYSTEM_SETTINGS_SUCCESS: {
      const {
        agencies,
        modules,
        default_locale: defaultLocale,
        base_language: baseLanguage,
        primero_version: primeroVersion,
        reporting_location_config: reportingLocationConfig,
        age_ranges: ageRanges,
        approvals_labels: approvalsLabels,
        code_of_conduct: codesOfConduct,
        system_options: systemOptions,
        export_require_password: exportRequirePassword,
        primary_age_range: primaryAgeRange,
        incident_reporting_location_config: incidentReportingLocationConfig,
        audit_log: auditLog
      } = payload.data;

      return state.merge(
        fromJS({
          agencies,
          modules: mapEntriesToRecord(modules, PrimeroModuleRecord),
          defaultLocale,
          baseLanguage,
          primeroVersion,
          reportingLocationConfig,
          incidentReportingLocationConfig,
          ageRanges,
          approvalsLabels,
          codesOfConduct,
          systemOptions,
          exportRequirePassword,
          primaryAgeRange,
          auditLog
        })
      );
    }
    case actions.SET_USER_IDLE:
      return state.set("userIdle", payload);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE.set("primero", state.get("primero")).set("theme", state.get("theme"));
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
    case actions.FETCH_WEBPUSH_CONFIG_SUCCESS:
      return state.set("webpush", fromJS(payload.data));
    case actions.DISABLE_NAVIGATION:
      return state.set("disabledApplication", payload);
    case actions.FETCH_MANAGED_ROLES_SUCCESS:
      return state.set("managedRoles", fromJS(payload.data));
    case actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_STARTED:
      return state
        .setIn(["referralAuthorizationRoles", "loading"], true)
        .setIn(["referralAuthorizationRoles", "errors"], false);
    case actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_SUCCESS:
      return state.setIn(["referralAuthorizationRoles", "data"], fromJS(payload.data));
    case actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_FINISHED:
      return state.setIn(["referralAuthorizationRoles", "loading"], false);
    case actions.FETCH_REFERRAL_AUTHORIZATION_ROLES_FAILURE:
      return state.setIn(["referralAuthorizationRoles", "errors"], true);
    case actions.FETCH_SANDBOX_UI_SUCCESS:
      return state.set("primero", fromJS(payload.data));
    case actions.FETCH_AGENCY_LOGO_OPTIONS_SUCCESS:
      return state.setIn(["primero", "agenciesLogoPdf"], fromJS(payload.data));
    case actions.SET_RETURN_URL:
      return state.set("returnUrl", fromJS(payload));
    case actions.SET_THEME:
      return state.set("theme", payload);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
