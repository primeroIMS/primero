import { DB_COLLECTIONS_NAMES } from "../../db";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../record-actions/actions";
import { INCIDENT_FROM_CASE, RECORD_PATH, RECORD_TYPES } from "../../config";
import { setSelectedForm } from "../record-form/action-creators";

import {
  CLEAR_METADATA,
  RECORD,
  SAVE_RECORD,
  FETCH_RECORD_ALERTS,
  FETCH_INCIDENT_FROM_CASE,
  SET_CASE_ID_FOR_INCIDENT,
  CLEAR_CASE_FROM_INCIDENT
} from "./actions";

const getSuccessCallback = ({
  dialogName,
  message,
  messageForQueue,
  recordType,
  redirect,
  saveMethod,
  incidentFromCase
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
        messageForQueue,
        options: {
          variant: "success",
          key: generate.messageKey(message)
        }
      },
      redirectWithIdFromResponse: !incidentFromCase && saveMethod !== "update",
      redirect: redirect === false ? false : redirect || `/${recordType}`
    },
    ...incidentFromCaseCallbacks
  ];

  if (dialogName !== "") {
    return [
      ...defaultSuccessCallback,
      {
        action: SET_DIALOG,
        payload: {
          dialog: dialogName,
          open: false
        }
      },
      {
        action: SET_DIALOG_PENDING,
        payload: {
          pending: false
        }
      }
    ];
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

export const saveRecord = (
  recordType,
  saveMethod,
  body,
  id,
  message,
  messageForQueue,
  redirect,
  queueAttachments = true,
  dialogName = "",
  incidentFromCase = false
) => async dispatch => {
  await dispatch({
    type: `${recordType}/${SAVE_RECORD}`,
    api: {
      id,
      recordType,
      path: saveMethod === "update" ? `${recordType}/${id}` : `${recordType}`,
      method: saveMethod === "update" ? "PATCH" : "POST",
      queueOffline: true,
      body,
      successCallback: getSuccessCallback({
        dialogName,
        message,
        messageForQueue,
        recordType,
        redirect,
        saveMethod,
        incidentFromCase
      }),
      db: {
        collection: DB_COLLECTIONS_NAMES.RECORDS,
        recordType
      },
      queueAttachments
    }
  });
};

export const fetchRecordsAlerts = (recordType, recordId) => ({
  type: `${recordType}/${FETCH_RECORD_ALERTS}`,
  api: {
    path: `${recordType}/${recordId}/alerts`
  }
});

export const clearCaseFromIncident = () => ({
  type: `cases/${CLEAR_CASE_FROM_INCIDENT}`
});

export const setCaseIdForIncident = (caseId, caseShortId) => ({
  type: `cases/${SET_CASE_ID_FOR_INCIDENT}`,
  payload: { caseId, caseShortId }
});

export const fetchIncidentFromCase = (caseId, caseShortId, moduleId) => {
  const { type: action, payload } = setCaseIdForIncident(caseId, caseShortId);
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
