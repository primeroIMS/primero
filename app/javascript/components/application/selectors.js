import { Map, fromJS } from "immutable";

import { displayNameHelper } from "../../libs";
import { DATA_PROTECTION_FIELDS } from "../record-creation-flow/constants";

import { PERMISSIONS, RESOURCE_ACTIONS, DEMO, LIMITED } from "./constants";
import NAMESPACE from "./namespace";

const getAppModuleByUniqueId = (state, uniqueId) =>
  state
    .getIn(["application", "modules"], fromJS([]))
    .find(module => module.get("unique_id") === uniqueId, null, fromJS([]));

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

export const selectLocales = state => state.getIn([NAMESPACE, "primero", "locales"], fromJS([]));

export const selectUserModules = state =>
  state.getIn([NAMESPACE, "modules"], Map({})).filter(m => {
    const userModules = state.getIn(["user", "modules"], null);

    return userModules ? userModules.includes(m.unique_id) : false;
  });

export const selectModule = (state, id) => {
  return selectUserModules(state)
    .filter(f => f.unique_id === id)
    .first();
};

export const selectUserIdle = state => state.getIn([NAMESPACE, "userIdle"], false);

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getAdminLevel = state => getReportingLocationConfig(state).get("admin_level");

export const getAgencyLogos = (state, fromApplication) => {
  if (fromApplication) {
    return state.getIn(["application", "primero", "logos"], fromJS([]));
  }

  return state.getIn(["application", "primero", "agencies"], fromJS([]));
};

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

export const getAgeRanges = (state, name = "primero") => state.getIn([NAMESPACE, "ageRanges", name], fromJS([]));

export const getReportableTypes = state => state.getIn([NAMESPACE, "reportableTypes"], fromJS([]));

export const getApprovalsLabels = (state, locale) => {
  const approvalsLabels = state
    .getIn([NAMESPACE, "approvalsLabels"], fromJS({}))
    .entrySeq()
    .reduce((acc, [key, value]) => {
      return acc.set(key, displayNameHelper(value, locale));
    }, Map({}));

  return approvalsLabels;
};

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
    option === DATA_PROTECTION_FIELDS ? fromJS([]) : false
  );

export const getCodeOfConductEnabled = state =>
  state.getIn([NAMESPACE, "systemOptions", "code_of_conduct_enabled"], false);

export const getAgencyTermsOfUse = state => selectAgencies(state).filter(agency => agency.get("terms_of_use_enabled"));

export const getLocationsAvailable = state => !state.getIn(["forms", "options", "locations"], fromJS([])).isEmpty();

export const getExportRequirePassword = state => state.getIn([NAMESPACE, "exportRequirePassword"], false);
