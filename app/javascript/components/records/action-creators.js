import { DB_COLLECTIONS_NAMES } from "../../db";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";
import { CLEAR_DIALOG } from "../action-dialog";
import { INCIDENT_FROM_CASE, METHODS, RECORD_PATH, RECORD_TYPES, SAVE_METHODS } from "../../config";
import { setSelectedForm } from "../record-form/action-creators";

import {
  CLEAR_METADATA,
  CLEAR_RECORD_ATTACHMENTS,
  RECORD,
  SAVE_RECORD,
  FETCH_RECORD_ALERTS,
  FETCH_INCIDENT_FROM_CASE,
  FETCH_TRACE_POTENTIAL_MATCHES,
  FETCH_TRACING_REQUEST_TRACES,
  SET_CASE_ID_FOR_INCIDENT,
  CLEAR_CASE_FROM_INCIDENT,
  SET_CASE_ID_REDIRECT,
  SET_SELECTED_RECORD,
  CLEAR_SELECTED_RECORD,
  SET_MACHED_CASE_FOR_TRACE,
  FETCH_CASES_POTENTIAL_MATCHES,
  SET_CASE_POTENTIAL_MATCH,
  CLEAR_CASE_POTENTIAL_MATCH,
  FETCH_CASE_MATCHED_TRACES,
  SET_SELECTED_POTENTIAL_MATCH,
  CLEAR_MATCHED_TRACES,
  UNMATCH_CASE_FOR_TRACE,
  CLEAR_POTENTIAL_MATCHES,
  EXTERNAL_SYNC,
  OFFLINE_INCIDENT_FROM_CASE
} from "./actions";

const getSuccessCallback = ({
  dialogName,
  message,
  messageFromQueue,
  recordType,
  redirect,
  saveMethod,
  willRedirectToIncident,
  incidentPath,
  moduleID
}) => {
  const selectedFormCallback = setSelectedForm(INCIDENT_FROM_CASE);
  const incidentFromCaseCallbacks =
    RECORD_TYPES[recordType] === RECORD_TYPES.incidents && willRedirectToIncident
      ? [
          { action: `cases/${CLEAR_CASE_FROM_INCIDENT}` },
          { action: selectedFormCallback.type, payload: selectedFormCallback.payload }
        ]
      : [];
  const defaultSuccessCallback = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        messageFromQueue,
        options: {
          variant: "success",
          key: generate.messageKey(message)
        }
      },
      moduleID,
      incidentPath,
      setCaseIncidentData: incidentPath && saveMethod !== SAVE_METHODS.update,
      redirectWithIdFromResponse:
        !redirect && !incidentPath && !willRedirectToIncident && saveMethod !== SAVE_METHODS.update,
      redirect: redirect === false ? false : redirect || `/${recordType}`,
      preventSyncAfterRedirect: !willRedirectToIncident && [SAVE_METHODS.update].includes(saveMethod)
    },
    ...incidentFromCaseCallbacks
  ];

  if (dialogName !== "") {
    return [
      ...defaultSuccessCallback,
      {
        action: CLEAR_DIALOG
      }
    ];
  }
  if (incidentPath) {
    return [...defaultSuccessCallback, `cases/${SET_CASE_ID_REDIRECT}`];
  }

  return defaultSuccessCallback;
};

export const clearMetadata = recordType => ({
  type: `${recordType}/${CLEAR_METADATA}`
});

export const fetchTracingRequestTraces = (id, asCallback = false) => ({
  ...(asCallback
    ? { action: `${RECORD_PATH.tracing_requests}/${FETCH_TRACING_REQUEST_TRACES}` }
    : { type: `${RECORD_PATH.tracing_requests}/${FETCH_TRACING_REQUEST_TRACES}` }),
  api: {
    path: `${RECORD_PATH.tracing_requests}/${id}/${RECORD_PATH.traces}`
  }
});

export const fetchRecord = (recordType, id, asCallback = false) => ({
  [asCallback ? "action" : "type"]: `${recordType}/${RECORD}`,
  api: {
    path: `${recordType}/${id}`,
    db: {
      collection: DB_COLLECTIONS_NAMES.RECORDS,
      recordType,
      id
    },
    ...(recordType === RECORD_PATH.tracing_requests ? { successCallback: [fetchTracingRequestTraces(id, true)] } : {})
  }
});

export const fetchRecordsAlerts = (recordType, recordId, asCallback = false) => ({
  ...(asCallback
    ? { action: `${recordType}/${FETCH_RECORD_ALERTS}` }
    : { type: `${recordType}/${FETCH_RECORD_ALERTS}` }),
  api: {
    path: `${recordType}/${recordId}/alerts`,
    skipDB: true,
    performFromQueue: true
  }
});

export const saveRecord = (
  recordType,
  saveMethod,
  body,
  id,
  message,
  messageFromQueue,
  redirect,
  queueAttachments = true,
  dialogName = "",
  willRedirectToIncident = false,
  moduleID,
  incidentPath = "",
  skipRecordAlerts = false
) => {
  const fetchRecordsAlertsCallback =
    id && !skipRecordAlerts && saveMethod === SAVE_METHODS.update ? [fetchRecordsAlerts(recordType, id, true)] : [];

  return {
    type: `${recordType}/${SAVE_RECORD}`,
    api: {
      id,
      recordType,
      path: saveMethod === SAVE_METHODS.update ? `${recordType}/${id}` : recordType,
      method: saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST,
      queueOffline: true,
      body,
      successCallback: [
        ...getSuccessCallback({
          dialogName,
          message,
          messageFromQueue,
          recordType,
          redirect,
          saveMethod,
          willRedirectToIncident,
          incidentPath,
          moduleID,
          id
        }),
        ...fetchRecordsAlertsCallback
      ],
      db: {
        collection: DB_COLLECTIONS_NAMES.RECORDS,
        recordType
      },
      queueAttachments
    }
  };
};

export const clearCaseFromIncident = () => ({
  type: `cases/${CLEAR_CASE_FROM_INCIDENT}`
});

export const setCaseIdForIncident = (caseId, caseIdDisplay) => ({
  type: `cases/${SET_CASE_ID_FOR_INCIDENT}`,
  payload: { caseId, caseIdDisplay }
});

export const fetchIncidentFromCase = (caseId, caseIdDisplay, moduleId) => {
  const { type: action, payload } = setCaseIdForIncident(caseId, caseIdDisplay);
  const successCallback = {
    action,
    payload,
    redirect: `/${RECORD_PATH.incidents}/${moduleId}/new`
  };

  return {
    type: `cases/${FETCH_INCIDENT_FROM_CASE}`,
    api: {
      path: `${RECORD_PATH.cases}/${caseId}/${RECORD_PATH.incidents}/new`,
      successCallback
    }
  };
};

export const offlineIncidentFromCase = payload => ({
  type: `cases/${OFFLINE_INCIDENT_FROM_CASE}`,
  payload
});

export const fetchIncidentwitCaseId = caseId => {
  return {
    type: `cases/${FETCH_INCIDENT_FROM_CASE}`,
    api: {
      path: `${RECORD_PATH.cases}/${caseId}/${RECORD_PATH.incidents}/new`
    }
  };
};

export const setSelectedRecord = (recordType, recordId) => ({
  type: `${recordType}/${SET_SELECTED_RECORD}`,
  payload: { id: recordId }
});

export const clearSelectedRecord = recordType => ({
  type: `${recordType}/${CLEAR_SELECTED_RECORD}`
});

export const clearRecordAttachments = (recordId, recordType) => ({
  type: `${recordType}/${CLEAR_RECORD_ATTACHMENTS}`,
  payload: { id: recordId, recordType }
});

export const setSelectedCasePotentialMatch = (tracingRequestId, recordType) => ({
  type: `${recordType}/${SET_CASE_POTENTIAL_MATCH}`,
  payload: { tracingRequestId }
});

export const fetchCasesPotentialMatches = (recordId, recordType) => ({
  type: `${recordType}/${FETCH_CASES_POTENTIAL_MATCHES}`,
  api: {
    path: `${recordType}/${recordId}/potential_matches`
  }
});

export const fetchTracePotentialMatches = (traceId, recordType) => ({
  type: `${recordType}/${FETCH_TRACE_POTENTIAL_MATCHES}`,
  api: {
    path: `${RECORD_PATH.traces}/${traceId}/potential_matches`
  }
});

export const setSelectedPotentialMatch = (potentialMatchId, recordType) => ({
  type: `${recordType}/${SET_SELECTED_POTENTIAL_MATCH}`,
  payload: { id: potentialMatchId, recordType }
});

export const setMachedCaseForTrace = ({ traceId, caseId, recordType, message }) => ({
  type: `${recordType}/${SET_MACHED_CASE_FOR_TRACE}`,
  api: {
    path: `${RECORD_PATH.traces}/${traceId}`,
    method: METHODS.PATCH,
    body: { data: { matched_case_id: caseId } },
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const unMatchCaseForTrace = ({ traceId, recordType, message }) => ({
  type: `${recordType}/${UNMATCH_CASE_FOR_TRACE}`,
  api: {
    path: `${RECORD_PATH.traces}/${traceId}`,
    method: METHODS.PATCH,
    body: { data: { matched_case_id: null } },
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const clearSelectedCasePotentialMatch = () => ({
  type: `${RECORD_PATH.cases}/${CLEAR_CASE_POTENTIAL_MATCH}`
});

export const fetchMatchedTraces = (recordType, recordId) => ({
  type: `${recordType}/${FETCH_CASE_MATCHED_TRACES}`,
  api: {
    path: `${recordType}/${recordId}/traces`
  }
});

export const clearMatchedTraces = () => ({
  type: `${RECORD_PATH.cases}/${CLEAR_MATCHED_TRACES}`
});

export const clearPotentialMatches = () => ({
  type: `${RECORD_PATH.cases}/${CLEAR_POTENTIAL_MATCHES}`
});

export const externalSync = (recordType, record) => ({
  type: `${recordType}/${EXTERNAL_SYNC}`,
  api: {
    path: `${recordType}/${record}/sync`,
    method: "POST"
  }
});
