// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List, Map, fromJS } from "immutable";
import { isEqual, isNil, omitBy, uniqBy } from "lodash";
import createCachedSelector from "re-reselect";
import { createSelectorCreator, defaultMemoize } from "reselect";
import { memoize } from "proxy-memoize";

import displayNameHelper from "../../libs/display-name-helper";
import { getLocale } from "../i18n/selectors";
import { DATA_PROTECTION_FIELDS } from "../record-creation-flow/constants";
import { currentUser } from "../user/selectors";
import { MODULES, RECORD_TYPES_PLURAL } from "../../config";

import { PERMISSIONS, RESOURCE_ACTIONS, DEMO, LIMITED } from "./constants";
import NAMESPACE from "./namespace";

const getAppModuleByUniqueId = (state, uniqueId) =>
  state
    .getIn(["application", "modules"], fromJS([]))
    .find(module => module.get("unique_id") === uniqueId, null, fromJS([]));

const getLoginBackground = state => state.hasIn([NAMESPACE, "theme", "colors", "loginBackgroundImage"], false);

export const selectAgencies = state => state.getIn([NAMESPACE, "agencies"], fromJS([]));

export const getAgenciesWithService = (state, service) => {
  const agencies = selectAgencies(state);

  return service ? agencies.filter(agency => agency.get("services", fromJS([])).includes(service)) : agencies;
};

export const getEnabledAgencies = (state, service) => {
  const enabledAgencies = state.getIn([NAMESPACE, "agencies"], fromJS([])).filter(agency => !agency.get("disabled"));

  if (service) {
    return enabledAgencies.filter(agency => agency.get("services", fromJS([])).includes(service));
  }

  return enabledAgencies;
};

export const selectModules = state => state.getIn([NAMESPACE, "modules"], fromJS([]));

export const selectAuditLogActions = state => state.getIn([NAMESPACE, "auditLog", "actions"], fromJS([]));
export const selectAuditLogRecordTypes = state => state.getIn([NAMESPACE, "auditLog", "record_types"], fromJS([]));

export const selectLocales = state => state.getIn([NAMESPACE, "primero", "locales"], fromJS([]));

export const selectUserModules = state =>
  state.getIn([NAMESPACE, "modules"], Map({})).filter(m => {
    const userModules = state.getIn(["user", "modules"], null);

    return userModules ? userModules.includes(m.unique_id) : false;
  });

export const selectModule = (state, id, fromUserModule = true) => {
  const moduleState = fromUserModule ? selectUserModules(state) : selectModules(state);

  return moduleState.find(userModule => userModule.unique_id === id, null, fromJS({}));
};

export const getWorkflowLabels = (state, id, recordType) => {
  if (id) {
    return selectModule(state, id).getIn(["workflows", recordType], []);
  }

  return uniqBy(
    selectModules(state)
      .reduce((prev, current) => [...prev, current.get("workflows")[recordType]], [])
      .filter(workflow => workflow)
      .flat(),
    "id"
  );
};

export const getAllWorkflowLabels = (state, recordType) => {
  return selectUserModules(state).reduce((prev, current) => {
    if (![MODULES.GBV, MODULES.MRM].includes(current.get("unique_id"))) {
      prev.push([current.name, current.getIn(["workflows", recordType], []), current.unique_id]);
    }

    return prev;
  }, []);
};

export const getServicesForm = (state, id) => selectModule(state, id).getIn(["options", "services_form"]);

export const getConsentform = (state, id) => selectModule(state, id).getIn(["options", "consent_form"]);

export const selectUserIdle = state => state.getIn([NAMESPACE, "userIdle"], false);

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getIncidentReportingLocationConfig = state =>
  state.getIn([NAMESPACE, "incidentReportingLocationConfig"], fromJS({}));

export const getAdminLevel = state => getReportingLocationConfig(state).get("admin_level");

export const getAgencyLogos = (state, fromApplication) => {
  if (fromApplication) {
    return state.getIn(["application", "primero", "logos"], fromJS([]));
  }

  return state.getIn(["application", "primero", "agencies"], fromJS([]));
};

export const hasAgencyLogos = (state, fromApplication) => !getAgencyLogos(state, fromApplication).isEmpty();

export const getAgencyLogosPdf = (state, fromApplication) => {
  if (fromApplication) {
    return state.getIn(["application", "primero", "agenciesLogoPdf"], fromJS([]));
  }

  return state.getIn(["application", "primero", "agencies_logo_options"], fromJS([]));
};

export const getAgency = (state, id) =>
  state
    .getIn(["application", "agencies"], fromJS([]))
    .filter(agency => agency.get("id") === id)
    .first();

export const getSystemPermissions = state => state.getIn([NAMESPACE, PERMISSIONS], fromJS({}));

export const getResourceActions = (state, resource) =>
  getSystemPermissions(state).getIn([RESOURCE_ACTIONS, resource], fromJS([]));

export const getAgeRanges = (state, name = "primero") => {
  const userModules = selectUserModules(state);
  const ageRange = state.getIn([NAMESPACE, "ageRanges", name], fromJS([]));

  if (userModules.size === 1) {
    return userModules.first()?.age_range || ageRange;
  }

  return ageRange;
};

export const getPrimaryAgeRange = state => {
  return state.getIn([NAMESPACE, "primaryAgeRange"], "primero");
};

export const getPrimaryAgeRanges = state => getAgeRanges(state, getPrimaryAgeRange(state));

export const getReportableTypes = state => state.getIn([NAMESPACE, "reportableTypes"], fromJS([]));

export const approvalsLabels = state => {
  const userModules = selectUserModules(state);
  const systemApprovalLabels = state.getIn([NAMESPACE, "approvalsLabels"], fromJS({}));
  const defaultModules =
    userModules.size === 1 ? userModules.first().get("approvals_labels") || systemApprovalLabels : systemApprovalLabels;

  const userModulesApprovalLabels = userModules.reduce((prev, current) => {
    return { ...prev, [current.unique_id]: current.get("approvals_labels") };
  }, {});

  return fromJS({ default: defaultModules, ...userModulesApprovalLabels });
};

export const getApprovalsLabels = createCachedSelector(getLocale, approvalsLabels, (locale, data) => {
  const labels = data.entrySeq().reduce((acc, [key, value]) => {
    return acc.set(
      key,
      value?.entrySeq()?.reduce((prev, [subKey, subValue]) => {
        return prev.set(subKey, displayNameHelper(subValue, locale));
      }, Map({}))
    );
  }, Map({}));

  return labels;
})({
  keySelector: (_state, options) => JSON.stringify(omitBy(options, isNil)),
  selectorCreator: createSelectorCreator(defaultMemoize, isEqual)
});

export const getUserGroups = state => state.getIn([NAMESPACE, "userGroups"], fromJS([]));

export const getEnabledUserGroups = state => getUserGroups(state).filter(userGroup => !userGroup.get("disabled"));

export const getRoles = state => state.getIn([NAMESPACE, "roles"], fromJS([]));

export const getRole = (state, uniqueID) =>
  getRoles(state).find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

export const getRoleName = (state, uniqueID) => getRole(state, uniqueID).get("name", "");

export const getDisabledApplication = state => state.getIn([NAMESPACE, "disabledApplication"], false);

export const getDemo = state => state.getIn([NAMESPACE, "primero", DEMO], false);

export const getConfigUI = state => state.getIn([NAMESPACE, "primero", "config_ui"], "");

export const getLimitedConfigUI = state => getConfigUI(state) === LIMITED;

export const getIsEnabledWebhookSyncFor = (state, primeroModule, recordType) => {
  const useWebhookSyncFor = getAppModuleByUniqueId(state, primeroModule).getIn(
    ["options", "use_webhook_sync_for"],
    fromJS([])
  );

  return useWebhookSyncFor.includes(recordType);
};

export const getCodesOfConduct = state => state.getIn([NAMESPACE, "codesOfConduct"], fromJS({}));

export const getOptionFromAppModule = (state, primeroModule, option) =>
  getAppModuleByUniqueId(state, primeroModule).getIn(
    ["options", option],
    option === DATA_PROTECTION_FIELDS ? [] : false
  );

export const getCodeOfConductEnabled = state =>
  state.getIn([NAMESPACE, "systemOptions", "code_of_conduct_enabled"], false);

export const getAgencyTermsOfUse = state => selectAgencies(state).filter(agency => agency.get("terms_of_use_enabled"));

export const getLocationsAvailable = state => !state.getIn(["forms", "options", "locations"], fromJS([])).isEmpty();

export const getExportRequirePassword = state => state.getIn([NAMESPACE, "exportRequirePassword"], false);

export const getRegistryTypes = (state, type) =>
  state
    .getIn(["application", "systemOptions", "registry_types"], fromJS([]))
    .find(registryType => registryType.get("id") === type, null, fromJS({}));

export const getFieldMode = state => state.getIn([NAMESPACE, "systemOptions", "field_mode"], false);

export const getMaximumUsers = state => state.getIn([NAMESPACE, "systemOptions", "maximum_users"]);

export const getMaximumUsersWarning = state => state.getIn([NAMESPACE, "systemOptions", "maximum_users_warning"]);

export const getMaximumAttachmentsPerRecord = state =>
  state.getIn([NAMESPACE, "systemOptions", "maximum_attachments_per_record"]);

export const getAllowCaseCreationFromReferral = state =>
  state.getIn([NAMESPACE, "systemOptions", "allow_case_creation_from_referral"]);

export const getTheme = state => state.getIn([NAMESPACE, "theme"], fromJS({}));

export const getShowPoweredByPrimero = state => state.getIn([NAMESPACE, "theme", "showPoweredByPrimero"], false);

export const getUseContainedNavStyle = state => state.getIn([NAMESPACE, "theme", "useContainedNavStyle"], false);

export const getSiteTitle = state => state.getIn([NAMESPACE, "theme", "siteTitle"], "Primero");

export const getThemeLogos = state => state.getIn([NAMESPACE, "theme", "images", "logos"], {});

export const getAppData = memoize(state => {
  const modules = selectModules(state);
  const userModules = selectUserModules(state);
  const selectedApprovalsLabels = getApprovalsLabels(state);
  const disabledApplication = getDisabledApplication(state);
  const demo = getDemo(state);
  const limitedProductionSite = getLimitedConfigUI(state);
  const currentUserName = currentUser(state);
  const maximumUsers = getMaximumUsers(state);
  const maximumUsersWarning = getMaximumUsersWarning(state);
  const useContainedNavStyle = getUseContainedNavStyle(state);
  const showPoweredByPrimero = getShowPoweredByPrimero(state);
  const hasLoginLogo = getLoginBackground(state);
  const maximumttachmentsPerRecord = getMaximumAttachmentsPerRecord(state);

  return {
    modules,
    userModules,
    approvalsLabels: selectedApprovalsLabels,
    disabledApplication,
    demo,
    currentUserName,
    limitedProductionSite,
    maximumUsers,
    maximumUsersWarning,
    useContainedNavStyle,
    showPoweredByPrimero,
    hasLoginLogo,
    maximumttachmentsPerRecord
  };
});

export const getWebpushConfig = state => state.getIn([NAMESPACE, "webpush"], fromJS({}));

export const getReferralAuthorizationRoles = state =>
  state.getIn([NAMESPACE, "referralAuthorizationRoles", "data"], fromJS({}));

export const getReferralAuthorizationRolesLoading = state =>
  state.getIn([NAMESPACE, "referralAuthorizationRoles", "loading"], fromJS({}));

export const getListHeaders = (state, namespace) => {
  const listHeaders = state.getIn(["user", "listHeaders", namespace], List([]));

  if (namespace === RECORD_TYPES_PLURAL.case) {
    const moduleListHeaders = selectUserModules(state)?.reduce((prev, current) => {
      const moduleHeaders = current.getIn(["list_headers", namespace]);

      return moduleHeaders ? prev.merge(moduleHeaders) : prev;
    }, List());

    return moduleListHeaders
      ? listHeaders.filter(header => moduleListHeaders.includes(header.get("field_name")))
      : List();
  }

  return listHeaders;
};

export const getListHeadersByRecordAndCaseType = (state, { caseType, recordType, excludes = [] }) => {
  const listHeaders = state.getIn(["user", "listHeaders", recordType], List([]));

  const caseTypelistHeaders =
    selectModules(state)
      .find(primeroModule => primeroModule.getIn(["options", "case_type"], "person") === caseType)
      ?.getIn(["list_headers", recordType]) || fromJS([]);

  const headers = caseTypelistHeaders
    ? listHeaders.filter(header => caseTypelistHeaders.includes(header.get("field_name")))
    : List();

  return headers.filter(header => !excludes.includes(header.get("field_name")));
};
