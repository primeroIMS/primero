import { Map, List, fromJS } from "immutable";

import { RECORD_PATH } from "../../config/constants";

const fieldMapModule = (state, moduleID) =>
  state
    .getIn(["application", "modules"], fromJS([]))
    .find(recordModule => recordModule.get("unique_id") === moduleID, null, fromJS({}));

export const selectRecord = (state, query = {}) => {
  const { isEditOrShow = false, recordType, id } = query;

  if (isEditOrShow) {
    const index = state.getIn(["records", recordType, "data"], fromJS([])).findIndex(r => r.get("id") === id);

    return state.getIn(["records", recordType, "data", index], Map({}));
  }

  return null;
};

export const getIncidentAvailable = (state, id) => {
  const online = state.getIn(["connectivity", "online"], false);
  const index = state.getIn(["records", RECORD_PATH.incidents, "data"], fromJS([])).findIndex(r => r.get("id") === id);

  if (online) {
    return true;
  }

  return index > -1;
};

export const selectRecordAttribute = (state, recordType, id, attribute) => {
  const index = state.getIn(["records", recordType, "data"], List([])).findIndex(r => r.get("id") === id);

  if (index >= 0) {
    return state.getIn(["records", recordType, "data", index, attribute], "");
  }

  return "";
};

export const selectRecordsByIndexes = (state, recordType, indexes) =>
  (indexes || []).map(index => state.getIn(["records", recordType, "data"], List([])).get(index));

export const getSavingRecord = (state, recordType) => state.getIn(["records", recordType, "saving"], false);

export const getLoadingRecordState = (state, recordType) => state.getIn(["records", recordType, "loading"], false);

export const getRecordAlerts = (state, recordType) => state.getIn(["records", recordType, "recordAlerts"], List([]));

export const getRecordFormAlerts = (state, recordType, formUniqueId) =>
  state
    .getIn(["records", recordType, "recordAlerts"], List([]))
    .filter(alert => alert.get("form_unique_id") === formUniqueId);

export const getIncidentFromCase = state => {
  return state.getIn(["records", "cases", "incidentFromCase", "data"], fromJS({}));
};

export const getCaseIdForIncident = state => {
  return state.getIn(["records", "cases", "incidentFromCase", "incident_case_id"], false);
};

export const getFieldMap = (state, moduleID) => {
  const mapTo = fieldMapModule(state, moduleID).getIn(["field_map", "map_to"]);

  return fieldMapModule(state, mapTo).getIn(["field_map", "fields"], fromJS([]));
};

export const getSelectedRecord = (state, recordType) => state.getIn(["records", recordType, "selectedRecord"]);

export const getRecordAttachments = (state, recordType) =>
  state.getIn(["records", recordType, "recordAttachments"], fromJS({}));

export const getIsProcessingSomeAttachment = (state, recordType) =>
  getRecordAttachments(state, recordType)
    .valueSeq()
    .some(attachment => attachment.get("processing") === true);

export const getIsProcessingAttachments = (state, recordType, fieldName) =>
  getRecordAttachments(state, recordType).getIn([fieldName, "processing"], false);

export const getIsPendingAttachments = (state, recordType, fieldName) =>
  getRecordAttachments(state, recordType).getIn([fieldName, "pending"], false);

export const getCasesPotentialMatches = state =>
  state.getIn(["records", "cases", "potentialMatches", "data"], fromJS([]));

export const getLoadingCasesPotentialMatches = state =>
  state.getIn(["records", "cases", "potentialMatches", "loading"], false);

export const getSelectedPotentialMatch = (state, recordType) =>
  state.getIn(["records", recordType, "potentialMatches", "selectedPotentialMatch"], fromJS({}));

export const getMatchedTraces = state => state.getIn(["records", "cases", "matchedTraces", "data"], fromJS([]));

export const getLoadingMatchedTraces = state => state.getIn(["records", "cases", "matchedTraces", "loading"], false);

export const getMatchedTrace = (state, matchedTraceId) => {
  const potentialMatches = getCasesPotentialMatches(state);

  return potentialMatches.size > 0
    ? potentialMatches.find(potentialMatch => potentialMatch.getIn(["trace", "id"]) === matchedTraceId)
    : fromJS({});
};
