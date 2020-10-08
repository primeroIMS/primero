import { DB_COLLECTIONS_NAMES } from "../../db";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../record-actions/actions";
import { RECORD_PATH } from "../../config";

import {
  CLEAR_METADATA,
  RECORD,
  SAVE_RECORD,
  FETCH_RECORD_ALERTS,
  FETCH_INCIDENT_FROM_CASE,
  SET_CASE_ID_FOR_INCIDENT,
  CLEAR_CASE_FROM_INCIDENT
} from "./actions";

const getSuccessCallback = ({ dialogName, message, messageForQueue, recordType, redirect, saveMethod }) => {
  const defaultSuccessCallback = [
    { action: `cases/${CLEAR_CASE_FROM_INCIDENT}` },
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
      redirectWithIdFromResponse: saveMethod !== "update",
      redirect: redirect === false ? false : redirect || `/${recordType}`
    }
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
  dialogName = ""
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
        saveMethod
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

export const fetchIncidentFromCase = (caseId, moduleId) => ({
  type: `cases/${FETCH_INCIDENT_FROM_CASE}`,
  api: {
    path: `${RECORD_PATH.cases}/${caseId}/${RECORD_PATH.incidents}/new`,
    successCallback: {
      action: `cases/${SET_CASE_ID_FOR_INCIDENT}`,
      payload: { caseId },
      redirect: `/${RECORD_PATH.incidents}/${moduleId}/new`
    }
  }
});
