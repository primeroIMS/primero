// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map, List } from "immutable";

import { mergeRecord } from "../../libs";
import { DEFAULT_METADATA, INCIDENT_CASE_ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD, RECORD_TYPES } from "../../config";

import {
  RECORDS_STARTED,
  RECORD_STARTED,
  RECORDS_FAILURE,
  RECORDS_SUCCESS,
  RECORDS_FINISHED,
  RECORD,
  SAVE_RECORD_STARTED,
  SAVE_RECORD_FINISHED,
  SAVE_RECORD_FAILURE,
  SAVE_RECORD_SUCCESS,
  RECORD_SUCCESS,
  RECORD_FAILURE,
  RECORD_FINISHED,
  SERVICE_REFERRED_SAVE,
  FETCH_RECORD_ALERTS_SUCCESS,
  DELETE_ALERT_FROM_RECORD_SUCCESS,
  FETCH_INCIDENT_FROM_CASE_SUCCESS,
  CLEAR_METADATA,
  CLEAR_CASE_FROM_INCIDENT,
  SET_CASE_ID_FOR_INCIDENT,
  SET_CASE_ID_REDIRECT,
  SET_SELECTED_RECORD,
  CLEAR_SELECTED_RECORD,
  SAVE_ATTACHMENT_SUCCESS,
  DELETE_ATTACHMENT_SUCCESS,
  SET_ATTACHMENT_STATUS,
  CLEAR_RECORD_ATTACHMENTS,
  FETCH_CASES_POTENTIAL_MATCHES_STARTED,
  FETCH_CASES_POTENTIAL_MATCHES_SUCCESS,
  FETCH_CASES_POTENTIAL_MATCHES_FINISHED,
  FETCH_CASES_POTENTIAL_MATCHES_FAILURE,
  FETCH_TRACE_POTENTIAL_MATCHES_FAILURE,
  FETCH_TRACE_POTENTIAL_MATCHES_FINISHED,
  FETCH_TRACE_POTENTIAL_MATCHES_STARTED,
  FETCH_TRACE_POTENTIAL_MATCHES_SUCCESS,
  SET_SELECTED_POTENTIAL_MATCH,
  SET_MACHED_CASE_FOR_TRACE_FAILURE,
  SET_MACHED_CASE_FOR_TRACE_FINISHED,
  SET_MACHED_CASE_FOR_TRACE_STARTED,
  SET_MACHED_CASE_FOR_TRACE_SUCCESS,
  FETCH_TRACING_REQUEST_TRACES_FAILURE,
  FETCH_TRACING_REQUEST_TRACES_FINISHED,
  FETCH_TRACING_REQUEST_TRACES_STARTED,
  FETCH_TRACING_REQUEST_TRACES_SUCCESS,
  SET_CASE_POTENTIAL_MATCH,
  CLEAR_CASE_POTENTIAL_MATCH,
  FETCH_CASE_MATCHED_TRACES_FAILURE,
  FETCH_CASE_MATCHED_TRACES_FINISHED,
  FETCH_CASE_MATCHED_TRACES_STARTED,
  FETCH_CASE_MATCHED_TRACES_SUCCESS,
  CLEAR_MATCHED_TRACES,
  UNMATCH_CASE_FOR_TRACE_SUCCESS,
  CLEAR_POTENTIAL_MATCHES,
  EXTERNAL_SYNC_SUCCESS,
  OFFLINE_INCIDENT_FROM_CASE,
  MARK_FOR_OFFLINE_SUCCESS,
  MARK_FOR_OFFLINE_STARTED,
  MARK_FOR_OFFLINE_FINISHED,
  MARK_FOR_OFFLINE_FAILURE,
  CREATE_CASE_FROM_FAMILY_MEMBER_STARTED,
  CREATE_CASE_FROM_FAMILY_MEMBER_SUCCESS,
  CREATE_CASE_FROM_FAMILY_MEMBER_FAILURE,
  CREATE_CASE_FROM_FAMILY_MEMBER_FINISHED,
  FETCH_LINK_INCIDENT_TO_CASE_DATA_SUCCESS,
  FETCH_LINK_INCIDENT_TO_CASE_DATA,
  FETCH_LINK_INCIDENT_TO_CASE_DATA_FINISHED,
  CREATE_CASE_FROM_FAMILY_DETAIL_STARTED,
  CREATE_CASE_FROM_FAMILY_DETAIL_SUCCESS,
  CREATE_CASE_FROM_FAMILY_DETAIL_FAILURE,
  CREATE_CASE_FROM_FAMILY_DETAIL_FINISHED,
  FETCH_RECORD_RELATIONSHIPS_SUCCESS,
  FETCH_RECORD_RELATIONSHIPS_STARTED,
  FETCH_RECORD_RELATIONSHIPS_FINISHED,
  FETCH_RECORD_RELATIONSHIPS_FAILURE,
  FETCH_RELATED_RECORDS_STARTED,
  FETCH_RELATED_RECORDS_SUCCESS,
  FETCH_RELATED_RECORDS_FINISHED,
  FETCH_RELATED_RECORDS_FAILURE,
  ADD_RECORD_RELATIONSHIP,
  REMOVE_RECORD_RELATIONSHIP,
  CLEAR_RECORD_RELATIONSHIPS
} from "./actions";

const DEFAULT_STATE = Map({ data: List([]) });

export default namespace =>
  (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
      case `${namespace}/${RECORDS_STARTED}`:
      case `${namespace}/${RECORD_STARTED}`:
        return state.set("loading", fromJS(payload)).set("errors", false);
      case `${namespace}/${RECORDS_FAILURE}`:
        return state.set("errors", true).set("loading", false);
      case `${namespace}/${MARK_FOR_OFFLINE_STARTED}`: {
        return state.set("markForMobileLoading", true);
      }
      case `${namespace}/${MARK_FOR_OFFLINE_FAILURE}`:
      case `${namespace}/${MARK_FOR_OFFLINE_FINISHED}`: {
        return state.set("markForMobileLoading", false);
      }
      case `${namespace}/${MARK_FOR_OFFLINE_SUCCESS}`: {
        const { data } = payload;

        return state.update("data", records => {
          return records.map(record => {
            const recordInData = data.find(item => item.id === record.get("id"));

            if (recordInData) {
              return mergeRecord(record, fromJS(recordInData));
            }

            return record;
          });
        });
      }
      case `${namespace}/${RECORDS_SUCCESS}`: {
        const { data, metadata } = payload;
        const selectedRecordId = state.get("selectedRecord");
        const selectedRecordWillUpdate = selectedRecordId
          ? data.some(recordUpdate => recordUpdate.id === selectedRecordId)
          : false;
        const selectedRecord =
          selectedRecordId && !selectedRecordWillUpdate
            ? state.get("data").find(record => record.get("id") === selectedRecordId)
            : null;

        return state
          .update("data", records => {
            return fromJS(
              data.map(recordUpdate => {
                const index = records.findIndex(record => record.get("id") === recordUpdate.id);

                if (index !== -1) {
                  return mergeRecord(records.get(index), fromJS(recordUpdate));
                }

                return recordUpdate;
              })
            ).concat(selectedRecord?.toSeq()?.size ? fromJS([selectedRecord]) : fromJS([]));
          })
          .set("metadata", fromJS(metadata));
      }
      case `${namespace}/${RECORDS_FINISHED}`:
        return state.set("loading", false);
      case `${namespace}/${RECORD}`:
        return state.set("loading", true);
      case `${namespace}/${SAVE_RECORD_STARTED}`:
        return state.set("saving", true);
      case `${namespace}/${SAVE_RECORD_FINISHED}`:
      case `${namespace}/${SAVE_RECORD_FAILURE}`:
        return state.set("saving", false);
      case `${namespace}/${SAVE_RECORD_SUCCESS}`:
      case `${namespace}/${SAVE_ATTACHMENT_SUCCESS}`:
      case `${namespace}/${DELETE_ATTACHMENT_SUCCESS}`:
      case `${namespace}/${RECORD_SUCCESS}`: {
        const { data } = payload;
        const index = state.get("data").findIndex(r => r.get("id") === data.id);

        if (index !== -1) {
          const { incident_details: incidents, services_section: services } = data;

          const stateWithAlertCount = {
            ...data,
            alert_count: incidents?.length || 0 + services?.length || 0
          };

          return state
            .updateIn(["data", index], u =>
              mergeRecord(u, fromJS(incidents?.length || services?.length ? stateWithAlertCount : data))
            )
            .set("errors", false);
        }

        return state
          .update("data", u => {
            if (data) {
              return u.push(fromJS(data));
            }

            return u;
          })
          .set("errors", false);
      }
      case `${namespace}/${RECORD_FAILURE}`:
        return state.set("errors", true);
      case `${namespace}/${RECORD_FINISHED}`:
        return state.set("loading", false);
      case `${namespace}/${DELETE_ALERT_FROM_RECORD_SUCCESS}`:
        state.set("alert_count", state.get("alert_count") - 1);

        return state.set(
          "recordAlerts",
          state.get("recordAlerts").filter(alert => alert.get("unique_id") !== payload.alertId)
        );
      case `${namespace}/${FETCH_RECORD_ALERTS_SUCCESS}`:
        return state.set("recordAlerts", fromJS(payload.data));
      case "user/LOGOUT_SUCCESS":
        return DEFAULT_STATE;
      case `${namespace}/${SERVICE_REFERRED_SAVE}`: {
        const serviceRecordId = payload.json.data.service_record_id;
        const { id: recordId, services_section: servicesSection } = payload.json.data.record;

        const referredService = fromJS(servicesSection || []).find(
          service => service.get("unique_id") === serviceRecordId
        );

        if (referredService?.size) {
          const recordIndex = state.get("data").findIndex(record => record.get("id") === recordId);

          const serviceIndex = state
            .getIn(["data", recordIndex, "services_section"])
            ?.findIndex(service => service.get("unique_id") === referredService.get("unique_id"));

          return state.updateIn(["data", recordIndex, "services_section", serviceIndex], data =>
            data?.merge(referredService)
          );
        }

        return state;
      }
      case `${namespace}/${CLEAR_METADATA}`:
        return state.set("metadata", fromJS(DEFAULT_METADATA));
      case `${namespace}/${FETCH_INCIDENT_FROM_CASE_SUCCESS}`:
        return RECORD_TYPES[namespace] === RECORD_TYPES.cases
          ? state.setIn(["incidentFromCase", "data"], fromJS(payload.data))
          : state;
      case `${namespace}/${OFFLINE_INCIDENT_FROM_CASE}`: {
        const { caseID, caseDisplayID, data } = payload;

        return state
          .setIn(
            ["incidentFromCase", "data"],
            fromJS({ ...data, [INCIDENT_CASE_ID_DISPLAY_FIELD]: caseDisplayID, [INCIDENT_CASE_ID_FIELD]: caseID })
          )
          .setIn(["incidentFromCase", INCIDENT_CASE_ID_FIELD], caseID)
          .setIn(["incidentFromCase", INCIDENT_CASE_ID_DISPLAY_FIELD], caseDisplayID);
      }
      case `${namespace}/${SET_CASE_ID_FOR_INCIDENT}`:
        return RECORD_TYPES[namespace] === RECORD_TYPES.cases
          ? state
              .setIn(["incidentFromCase", INCIDENT_CASE_ID_FIELD], payload.caseId)
              .setIn(["incidentFromCase", INCIDENT_CASE_ID_DISPLAY_FIELD], payload.caseIdDisplay)
          : state;
      case `${namespace}/${CLEAR_CASE_FROM_INCIDENT}`:
        return state.delete("incidentFromCase");
      case `${namespace}/${SET_CASE_ID_REDIRECT}`: {
        return RECORD_TYPES[namespace] === RECORD_TYPES.cases
          ? state.setIn(["incidentFromCase", INCIDENT_CASE_ID_FIELD], payload.json?.data?.id)
          : state;
      }
      case `${namespace}/${SET_SELECTED_RECORD}`: {
        return state.setIn(["selectedRecord"], payload.id);
      }
      case `${namespace}/${CLEAR_SELECTED_RECORD}`: {
        return state.delete("selectedRecord");
      }
      case `${namespace}/${SET_ATTACHMENT_STATUS}`: {
        return state.updateIn(["recordAttachments", payload.fieldName], data =>
          (data?.size ? data : fromJS({})).merge(fromJS(payload))
        );
      }
      case `${namespace}/${CLEAR_RECORD_ATTACHMENTS}`: {
        return state.set("recordAttachments", fromJS({}));
      }
      case `${namespace}/${FETCH_CASES_POTENTIAL_MATCHES_STARTED}`:
      case `${namespace}/${FETCH_TRACE_POTENTIAL_MATCHES_STARTED}`:
        return state.setIn(["potentialMatches", "loading"], true).setIn(["potentialMatches", "errors"], false);
      case `${namespace}/${FETCH_CASES_POTENTIAL_MATCHES_SUCCESS}`:
      case `${namespace}/${FETCH_TRACE_POTENTIAL_MATCHES_SUCCESS}`:
        return state
          .setIn(["potentialMatches", "data"], fromJS(payload.data.potential_matches))
          .setIn(["potentialMatches", "record"], fromJS(payload.data.record));
      case `${namespace}/${FETCH_CASES_POTENTIAL_MATCHES_FINISHED}`:
      case `${namespace}/${FETCH_TRACE_POTENTIAL_MATCHES_FINISHED}`:
        return state.setIn(["potentialMatches", "loading"], false);
      case `${namespace}/${FETCH_CASES_POTENTIAL_MATCHES_FAILURE}`:
      case `${namespace}/${FETCH_TRACE_POTENTIAL_MATCHES_FAILURE}`:
        return state.setIn(["potentialMatches", "errors"], true);
      case `${namespace}/${SET_SELECTED_POTENTIAL_MATCH}`: {
        return state.setIn(
          ["potentialMatches", "selectedPotentialMatch"],
          state
            .getIn(["potentialMatches", "data"])
            .find(potentialMatch => potentialMatch.getIn(["case", "id"]) === payload.id)
        );
      }
      case `${namespace}/${SET_MACHED_CASE_FOR_TRACE_STARTED}`: {
        return state.set("loading", true);
      }
      case `${namespace}/${SET_MACHED_CASE_FOR_TRACE_SUCCESS}`: {
        const { tracing_request_id: tracingRequestId, id } = payload.data;
        const index = state.get("data").findIndex(r => r.get("id") === tracingRequestId);
        const traceIndex = state
          .getIn(["data", index, "tracing_request_subform_section"])
          .findIndex(trace => trace.get("unique_id") === id);

        return state.updateIn(["data", index, "tracing_request_subform_section", traceIndex], u =>
          mergeRecord(u, fromJS(payload.data))
        );
      }
      case `${namespace}/${UNMATCH_CASE_FOR_TRACE_SUCCESS}`: {
        const { tracing_request_id: tracingRequestId, id } = payload.data;
        const index = state.get("data").findIndex(record => record.get("id") === tracingRequestId);
        const traceIndex = state
          .getIn(["data", index, "tracing_request_subform_section"])
          .findIndex(trace => trace.get("unique_id") === id);

        return state.updateIn(["data", index, "tracing_request_subform_section", traceIndex], tracingRequest =>
          mergeRecord(tracingRequest, fromJS(payload.data))
        );
      }
      case `${namespace}/${SET_MACHED_CASE_FOR_TRACE_FAILURE}`:
        return state.set("errors", true);
      case `${namespace}/${SET_MACHED_CASE_FOR_TRACE_FINISHED}`:
        return state.set("loading", false);
      case `${namespace}/${FETCH_TRACING_REQUEST_TRACES_STARTED}`: {
        return state.set("loading", true);
      }
      case `${namespace}/${FETCH_TRACING_REQUEST_TRACES_SUCCESS}`: {
        const { data } = payload;

        return data.reduce((newState, trace) => {
          const { tracing_request_id: tracingRequestId, id } = trace;
          const index = newState.get("data").findIndex(r => r.get("id") === tracingRequestId);
          const traceIndex = newState
            .getIn(["data", index, "tracing_request_subform_section"], fromJS([]))
            .findIndex(currentTrace => currentTrace.get("unique_id") === id);

          return traceIndex >= 0
            ? newState.updateIn(["data", index, "tracing_request_subform_section", traceIndex], u =>
                mergeRecord(u, fromJS(trace))
              )
            : newState;
        }, state);
      }
      case `${namespace}/${FETCH_TRACING_REQUEST_TRACES_FAILURE}`: {
        return state.set("errors", true);
      }
      case `${namespace}/${FETCH_TRACING_REQUEST_TRACES_FINISHED}`: {
        return state.set("loading", false);
      }
      case `${namespace}/${SET_CASE_POTENTIAL_MATCH}`: {
        const potentialMatches = state.getIn(["potentialMatches", "data"], fromJS([]));
        const potentialMatchObj = potentialMatches.find(
          potentialMatch => potentialMatch.getIn(["trace", "tracing_request_id"], "") === payload.tracingRequestId
        );

        return state.setIn(["potentialMatches", "selectedPotentialMatch"], potentialMatchObj);
      }
      case `${namespace}/${CLEAR_CASE_POTENTIAL_MATCH}`:
        return state.deleteIn(["potentialMatches", "selectedPotentialMatch"]);
      case `${namespace}/${FETCH_CASE_MATCHED_TRACES_STARTED}`:
        return state.setIn(["matchedTraces", "loading"], true).setIn(["matchedTraces", "errors"], false);
      case `${namespace}/${FETCH_CASE_MATCHED_TRACES_SUCCESS}`:
        return state.setIn(["matchedTraces", "data"], fromJS(payload.data));
      case `${namespace}/${FETCH_CASE_MATCHED_TRACES_FINISHED}`:
        return state.setIn(["matchedTraces", "loading"], false);
      case `${namespace}/${FETCH_CASE_MATCHED_TRACES_FAILURE}`:
        return state.setIn(["matchedTraces", "errors"], true);
      case `${namespace}/${CLEAR_MATCHED_TRACES}`:
        return state.delete("matchedTraces");
      case `${namespace}/${CLEAR_POTENTIAL_MATCHES}`:
        return state.delete("potentialMatches");
      case `${namespace}/${EXTERNAL_SYNC_SUCCESS}`: {
        const { data } = payload;
        const index = state.get("data").findIndex(record => record.get("id") === data.record_id);

        if (index !== -1) {
          return state.setIn(["data", index, "sync_status"], payload.data.sync_status);
        }

        return state;
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_MEMBER_STARTED}`: {
        return state.setIn(["case_from_family", "loading"], true);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_MEMBER_SUCCESS}`: {
        const recordIndex = state.get("data").findIndex(record => record.get("id") === payload.data.id);

        return state.setIn(["data", recordIndex, "family_members"], fromJS(payload.data.family_members));
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_MEMBER_FAILURE}`: {
        return state.setIn(["case_from_family", "errors"], true);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_MEMBER_FINISHED}`: {
        return state.setIn(["case_from_family", "loading"], false);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_DETAIL_STARTED}`: {
        return state.setIn(["case_from_family", "loading"], true);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_DETAIL_SUCCESS}`: {
        const recordIndex = state.get("data").findIndex(record => record.get("id") === payload.data.id);

        return state
          .setIn(["data", recordIndex, "family_details_section"], fromJS(payload.data.family_details_section))
          .setIn(["data", recordIndex, "family_number"], payload.data.family_number)
          .setIn(["data", recordIndex, "family_member_id"], payload.data.family_member_id)
          .setIn(["data", recordIndex, "family_id"], payload.data.family_id);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_DETAIL_FAILURE}`: {
        return state.setIn(["case_from_family", "errors"], true);
      }
      case `${namespace}/${CREATE_CASE_FROM_FAMILY_DETAIL_FINISHED}`: {
        return state.setIn(["case_from_family", "loading"], false);
      }
      case `${namespace}/${FETCH_LINK_INCIDENT_TO_CASE_DATA}`:
        return state.set("loading", true);
      case `${namespace}/${FETCH_LINK_INCIDENT_TO_CASE_DATA_SUCCESS}`:
        return state.set("data", fromJS(payload.data));
      case `${namespace}/${FETCH_LINK_INCIDENT_TO_CASE_DATA_FINISHED}`:
        return state.set("loading", false);
      case `${namespace}/${FETCH_RECORD_RELATIONSHIPS_SUCCESS}`:
        return state.setIn(["relationships", "data"], fromJS(payload.data || []));
      case `${namespace}/${FETCH_RECORD_RELATIONSHIPS_STARTED}`:
        return state.setIn(["relationships", "loading"], true);
      case `${namespace}/${FETCH_RECORD_RELATIONSHIPS_FINISHED}`:
        return state.setIn(["relationships", "loading"], false);
      case `${namespace}/${FETCH_RECORD_RELATIONSHIPS_FAILURE}`:
        return state.setIn(["relationships", "loading"], false).setIn(["relationships", "errors"], true);
      case `${namespace}/${FETCH_RELATED_RECORDS_STARTED}`:
        return state.setIn(["related_records", "loading"], payload).set("errors", false);
      case `${namespace}/${FETCH_RELATED_RECORDS_SUCCESS}`:
        return state.setIn(["related_records", "data"], fromJS(payload.data));
      case `${namespace}/${FETCH_RELATED_RECORDS_FINISHED}`:
        return state.setIn(["related_records", "loading"], false);
      case `${namespace}/${FETCH_RELATED_RECORDS_FAILURE}`:
        return state.setIn(["related_records", "loading"], false).set(["related_records", "errors"], true);
      case `${namespace}/${ADD_RECORD_RELATIONSHIP}`: {
        const { id, relationshipType, linkedRecord } = payload;

        return state.updateIn(["relationships", "data"], relationships => {
          if (relationships.some(relationship => relationship.get("case_id") === id)) {
            return relationships.reduce((memo, relationship) => {
              if (relationship.get("case_id") === id && relationship.get("disabled") === true) {
                return memo.push(relationship.set("disabled", false).set("changed", true));
              }

              return memo.push(relationship);
            }, fromJS([]));
          }

          return relationships.push(
            fromJS({
              case_id: id,
              relationship_type: relationshipType,
              primary: false,
              disabled: false,
              data: linkedRecord
            })
          );
        });
      }
      case `${namespace}/${REMOVE_RECORD_RELATIONSHIP}`: {
        const { id } = payload;

        return state.updateIn(["relationships", "data"], relationships =>
          relationships.reduce((memo, relationship) => {
            if (relationship.get("case_id") === id) {
              if (relationship.get("id")) {
                return memo.push(relationship.set("disabled", true).set("changed", true));
              }

              return memo;
            }

            return memo.push(relationship);
          }, fromJS([]))
        );
      }
      case `${namespace}/${CLEAR_RECORD_RELATIONSHIPS}`: {
        return state.set("relationships", fromJS({}));
      }
      default:
        return state;
    }
  };
