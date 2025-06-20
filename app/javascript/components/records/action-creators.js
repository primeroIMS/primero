// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import startsWith from "lodash/startsWith";
import compact from "lodash/compact";
import { fromJS } from "immutable";

import { DB_COLLECTIONS_NAMES, IDB_SAVEABLE_RECORD_TYPES } from "../../db";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";
import { CLEAR_DIALOG } from "../action-dialog";
import {
  INCIDENT_FROM_CASE,
  METHODS,
  RECORD_PATH,
  RECORD_TYPES,
  RECORD_TYPES_PLURAL,
  SAVE_METHODS
} from "../../config";
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
  OFFLINE_INCIDENT_FROM_CASE,
  CREATE_CASE_FROM_FAMILY_MEMBER,
  FETCH_LINK_INCIDENT_TO_CASE_DATA,
  CREATE_CASE_FROM_FAMILY_DETAIL,
  DELETE_ALERT_FROM_RECORD,
  DELETE_ALERT_FROM_RECORD_SUCCESS,
  FETCH_RECORD_RELATIONSHIPS,
  FETCH_RELATED_RECORDS,
  ADD_RECORD_RELATIONSHIP,
  REMOVE_RECORD_RELATIONSHIP,
  CLEAR_RECORD_RELATIONSHIPS
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
  const isIncidentType = RECORD_TYPES[recordType] === RECORD_TYPES.incidents;
  const isUpdate = saveMethod === SAVE_METHODS.update;
  const willRedirectToCase = isIncidentType && startsWith(redirect, `/${RECORD_PATH.cases}`);
  const selectedFormCallback = setSelectedForm(INCIDENT_FROM_CASE);
  const incidentFromCaseCallbacks = willRedirectToCase
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
      setCaseIncidentData: incidentPath && !isUpdate,
      redirectWithIdFromResponse: !redirect && !incidentPath && !willRedirectToIncident && !isUpdate,
      redirect: redirect === false ? false : redirect || `/${recordType}`,
      preventSyncAfterRedirect:
        !willRedirectToCase && !willRedirectToIncident && [SAVE_METHODS.update].includes(saveMethod)
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

const markForOfflineAction = (recordType, ids, includeSuccessCallbacks = true) => {
  return {
    type: `${recordType}/MARK_FOR_OFFLINE`,
    api: {
      path: `/${recordType.toLowerCase()}`,
      params: { id: ids },
      ...(IDB_SAVEABLE_RECORD_TYPES.includes(recordType) && {
        db: { collection: DB_COLLECTIONS_NAMES.RECORDS, recordType }
      }),
      ...(includeSuccessCallbacks && {
        successCallback: [
          {
            action: CLEAR_DIALOG
          },
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              messageKey: `${recordType}.mark_for_offline.success`,
              options: {
                variant: "success",
                key: generate.messageKey(`${recordType}.mark_for_offline.success`)
              }
            }
          }
        ]
      })
    }
  };
};

const deleteRelationshipCallback = ({ id, recordType, relationship }) => ({
  action: `${recordType}/DELETE_RECORD_RELATIONSHIP`,
  api: {
    path: `${recordType.toLowerCase()}/${id}/case_relationships/${relationship.get("id")}`,
    method: METHODS.DELETE
  }
});

const saveRelationshipCallback = ({ id, recordType, relationship }) => {
  const basePath = `${recordType.toLowerCase()}/${id}/case_relationships`;
  const relationshipId = relationship.get("id");
  const data = relationshipId
    ? { primary: relationship.get("primary", false), disabled: relationship.get("disabled", false) }
    : { case_id: relationship.get("case_id"), relationship_type: relationship.get("relationship_type") };

  return {
    action: `${recordType}/SAVE_RECORD_RELATIONSHIP`,
    api: {
      path: relationshipId ? `${basePath}/${relationshipId}` : basePath,
      method: relationshipId ? METHODS.PATCH : METHODS.POST,
      params: { data }
    }
  };
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

export const deleteAlertFromRecord = (recordType, recordId, alertId) => ({
  type: `${recordType}/${DELETE_ALERT_FROM_RECORD}`,
  api: {
    path: `${recordType}/${recordId}/alerts/${alertId}`,
    method: METHODS.DELETE,
    skipDB: true,
    performFromQueue: true,
    successCallback: {
      action: `${recordType}/${DELETE_ALERT_FROM_RECORD_SUCCESS}`,
      payload: { alertId }
    }
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
  skipRecordAlerts = false,
  relationshipsToSave = fromJS([])
) => {
  const fetchRecordsAlertsCallback =
    id && !skipRecordAlerts && saveMethod === SAVE_METHODS.update ? [fetchRecordsAlerts(recordType, id, true)] : [];
  const isTracingRequest = RECORD_TYPES[recordType] === RECORD_TYPES.tracing_requests;
  const isUpdate = saveMethod === SAVE_METHODS.update;
  const relationshipCallbacks = relationshipsToSave.map(relationship => {
    if (relationship.get("disabled", false) && relationship.get("changed", false)) {
      return deleteRelationshipCallback({ id, recordType, relationship });
    }

    return saveRelationshipCallback({ id, recordType, relationship });
  });

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
        ...(isTracingRequest && isUpdate && id ? [fetchTracingRequestTraces(id, true)] : []),
        ...fetchRecordsAlertsCallback,
        ...relationshipCallbacks
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

export const markForOffline =
  ({ recordType, ids = [], selectedRegistryIds = [] }) =>
  dispatch => {
    const selectedRegistryIdsCompacted = compact(selectedRegistryIds);

    if (selectedRegistryIdsCompacted.length > 0 && recordType === RECORD_TYPES_PLURAL.case) {
      dispatch(markForOfflineAction(RECORD_TYPES_PLURAL.registry_record, selectedRegistryIdsCompacted, false));
    }

    dispatch(markForOfflineAction(recordType, ids));
  };

export const createCaseFromFamilyMember = ({ familyId, familyMemberId }) => ({
  type: `${RECORD_PATH.families}/${CREATE_CASE_FROM_FAMILY_MEMBER}`,
  api: {
    path: `${RECORD_PATH.families}/${familyId}/case`,
    body: {
      data: { family_member_id: familyMemberId }
    },
    method: "POST",
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: `${RECORD_TYPES.cases}.messages.creation_success`,
          options: {
            variant: "success",
            key: generate.messageKey(`${RECORD_TYPES.cases}.messages.creation_success`)
          }
        }
      }
    ]
  }
});

export const fetchLinkIncidentToCaseData = payload => {
  return {
    type: `cases/${FETCH_LINK_INCIDENT_TO_CASE_DATA}`,
    api: {
      path: RECORD_PATH.cases,
      params: payload
    }
  };
};

export const linkIncidentToCase = ({ recordType, selectedIDs = [], caseID }) => {
  return {
    type: `${recordType}/LINK_INCIDENT_TO_CASE`,
    api: {
      path: `cases/${caseID}/incidents`,
      method: METHODS.POST,
      body: { data: { incident_ids: selectedIDs } },
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "incident.link_incident_to_case_success",
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        }
      }
    }
  };
};

export const createCaseFromFamilyDetail = ({ caseId, familyDetailId }) => ({
  type: `${RECORD_PATH.cases}/${CREATE_CASE_FROM_FAMILY_DETAIL}`,
  api: {
    path: `${RECORD_PATH.cases}/${caseId}/family`,
    body: {
      data: { family_detail_id: familyDetailId }
    },
    method: "POST",
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: `${RECORD_TYPES.cases}.messages.creation_success`,
          options: {
            variant: "success",
            key: generate.messageKey(`${RECORD_TYPES.cases}.messages.creation_success`)
          }
        }
      }
    ]
  }
});

export const fetchRecordRelationships = (caseID, relationshipType) => {
  return {
    type: `cases/${FETCH_RECORD_RELATIONSHIPS}`,
    api: {
      path: `${RECORD_PATH.cases}/${caseID}/case_relationships/?relationship_type=${relationshipType}`
    }
  };
};

export const fetchRelatedRecords = ({ recordType, relatedRecordType, data }) => ({
  type: `${recordType}/${FETCH_RELATED_RECORDS}`,
  api: {
    path: `/${relatedRecordType.toLowerCase()}`,
    params: data
  }
});

export const addRecordRelationship = ({ recordType, linkedRecordType, linkedRecord, id, relationshipType }) => ({
  type: `${recordType}/${ADD_RECORD_RELATIONSHIP}`,
  payload: { id, recordType: linkedRecordType, relationshipType, linkedRecord }
});

export const removeRecordRelationship = ({ recordType, linkedRecordType, linkedRecord, id, relationshipType }) => ({
  type: `${recordType}/${REMOVE_RECORD_RELATIONSHIP}`,
  payload: { id, recordType: linkedRecordType, relationshipType, linkedRecord }
});

export const clearRecordRelationships = (recordId, recordType) => ({
  type: `${recordType}/${CLEAR_RECORD_RELATIONSHIPS}`,
  payload: { id: recordId, recordType }
});
