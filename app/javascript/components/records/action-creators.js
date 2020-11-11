import { DB_COLLECTIONS_NAMES } from "../../db";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";
import { CLEAR_DIALOG } from "../action-dialog";
import { INCIDENT_FROM_CASE, METHODS, RECORD_PATH, RECORD_TYPES, SAVE_METHODS } from "../../config";
import { setSelectedForm } from "../record-form/action-creators";

import {
  CLEAR_METADATA,
  RECORD,
  SAVE_RECORD,
  FETCH_RECORD_ALERTS,
  FETCH_INCIDENT_FROM_CASE,
  SET_CASE_ID_FOR_INCIDENT,
  CLEAR_CASE_FROM_INCIDENT,
  SET_CASE_ID_REDIRECT,
  SET_SELECTED_RECORD,
  CLEAR_SELECTED_RECORD
} from "./actions";

const getSuccessCallback = ({
  dialogName,
  message,
  messageFromQueue,
  recordType,
  redirect,
  saveMethod,
  incidentFromCase,
  incidentPath,
  moduleID
}) => {
  const selectedFormCallback = setSelectedForm(INCIDENT_FROM_CASE);
  const incidentFromCaseCallbacks =
    RECORD_TYPES[recordType] === RECORD_TYPES.incidents && incidentFromCase
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
      redirectWithIdFromResponse: !incidentFromCase && saveMethod !== "update",
      redirect: redirect === false ? false : redirect || `/${recordType}`
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

export const fetchRecord = (recordType, id) => async dispatch => {
  dispatch({
    type: `${recordType}/${RECORD}`,
    api: {
      path: `${recordType}/${id}`,
      db: {
        collection: DB_COLLECTIONS_NAMES.RECORDS,
        recordType,
        id
      }
    }
  });
};

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
  incidentFromCase = false,
  moduleID,
  incidentPath = ""
) => async dispatch => {
  const fetchRecordsAlertsCallback =
    id && saveMethod === SAVE_METHODS.update ? [fetchRecordsAlerts(recordType, id, true)] : [];

  await dispatch({
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
          incidentFromCase,
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
  });
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
