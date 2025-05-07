// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isObject from "lodash/isObject";

import { DB_COLLECTIONS_NAMES } from "../../db";
import { METHODS, RECORD_PATH } from "../../config";
import { ENQUEUE_SNACKBAR } from "../notifier";
import { CLEAR_DIALOG } from "../action-dialog";
import RecordFormActions from "../record-form/actions";

import * as actionCreators from "./action-creators";
import { CLEAR_CASE_FROM_INCIDENT, FETCH_RECORD_ALERTS } from "./actions";

describe("records - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "DEPRECATED setFilters",
      "DEPRECATED fetchCases",
      "DEPRECATED fetchIncidents",
      "DEPRECATED fetchTracingRequests",
      "DEPRECATED updateRecordAttachments"
    ].forEach(property => {
      expect(creators).not.toHaveProperty(property);
      delete creators[property];
    });

    [
      "clearCaseFromIncident",
      "clearMatchedTraces",
      "clearMetadata",
      "clearPotentialMatches",
      "clearRecordAttachments",
      "clearSelectedCasePotentialMatch",
      "clearSelectedRecord",
      "createCaseFromFamilyDetail",
      "createCaseFromFamilyMember",
      "externalSync",
      "fetchCasesPotentialMatches",
      "fetchIncidentFromCase",
      "fetchIncidentwitCaseId",
      "fetchMatchedTraces",
      "fetchRecord",
      "fetchRecordsAlerts",
      "fetchTracePotentialMatches",
      "fetchTracingRequestTraces",
      "markForOffline",
      "offlineIncidentFromCase",
      "saveRecord",
      "setCaseIdForIncident",
      "setMachedCaseForTrace",
      "setSelectedCasePotentialMatch",
      "setSelectedPotentialMatch",
      "setSelectedRecord",
      "unMatchCaseForTrace",
      "deleteAlertFromRecord",
      "linkIncidentToCase",
      "fetchLinkIncidentToCaseData"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      expect(creators[property]).toBeInstanceOf(Function);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  describe("fetchRecord", () => {
    describe("when recordType is cases", () => {
      it("should return the correct object", () => {
        const expected = {
          type: `${RECORD_PATH.cases}/RECORD`,
          api: {
            path: `${RECORD_PATH.cases}/123`,
            db: {
              collection: DB_COLLECTIONS_NAMES.RECORDS,
              recordType: RECORD_PATH.cases,
              id: "123"
            }
          }
        };

        expect(actionCreators.fetchRecord("cases", "123")).toEqual(expected);
      });
    });

    describe("when recordType is tracing request", () => {
      it("should return the correct object", () => {
        const expected = {
          type: `${RECORD_PATH.tracing_requests}/RECORD`,
          api: {
            path: `${RECORD_PATH.tracing_requests}/123`,
            db: {
              collection: DB_COLLECTIONS_NAMES.RECORDS,
              recordType: RECORD_PATH.tracing_requests,
              id: "123"
            },
            successCallback: [
              {
                action: `${RECORD_PATH.tracing_requests}/FETCH_TRACING_REQUEST_TRACES`,
                api: { path: `${RECORD_PATH.tracing_requests}/123/${RECORD_PATH.traces}` }
              }
            ]
          }
        };

        expect(actionCreators.fetchRecord(RECORD_PATH.tracing_requests, "123")).toEqual(expected);
      });
    });
  });

  describe("should check the 'saveRecord' action creator", () => {
    const body = {
      data: {
        name_first: "Gerald",
        name_last: "Padgett",
        name_given_post_separation: "true",
        registration_date: "2019-08-06",
        sex: "male",
        age: 26,
        date_of_birth: "1993-06-05",
        module_id: "primeromodule-cp"
      }
    };

    it("when path it's 'update' should return the correct object", () => {
      const messageFn = () => {};
      const expected = {
        type: "cases/SAVE_RECORD",
        api: {
          id: "123",
          recordType: RECORD_PATH.cases,
          path: "cases/123",
          method: "PATCH",
          body,
          successCallback: [
            {
              action: "notifications/ENQUEUE_SNACKBAR",
              incidentPath: "",
              moduleID: undefined,
              payload: {
                message: messageFn,
                messageFromQueue: undefined,
                options: {
                  key: "",
                  variant: "success"
                }
              },
              preventSyncAfterRedirect: true,
              redirect: "/cases",
              redirectWithIdFromResponse: false,
              setCaseIncidentData: ""
            },
            {
              action: "cases/FETCH_RECORD_ALERTS",
              api: {
                path: "cases/123/alerts",
                performFromQueue: true,
                skipDB: true
              }
            }
          ],
          db: {
            collection: DB_COLLECTIONS_NAMES.RECORDS,
            recordType: RECORD_PATH.cases
          },
          queueAttachments: true,
          queueOffline: true
        }
      };

      expect(actionCreators.saveRecord("cases", "update", body, "123", messageFn)).toEqual(expected);
    });

    it("when path it's not 'update', the path and method should be different", () => {
      const messageFn = () => {};
      const expected = {
        type: "cases/SAVE_RECORD",
        api: {
          id: "123",
          recordType: RECORD_PATH.cases,
          path: "cases/123",
          method: "PATCH",
          body,
          successCallback: [
            {
              action: "notifications/ENQUEUE_SNACKBAR",
              incidentPath: "",
              moduleID: undefined,
              payload: {
                message: messageFn,
                messageFromQueue: undefined,
                options: {
                  key: "",
                  variant: "success"
                }
              },
              preventSyncAfterRedirect: true,
              redirect: "/cases",
              redirectWithIdFromResponse: false,
              setCaseIncidentData: ""
            },
            {
              action: "cases/FETCH_RECORD_ALERTS",
              api: {
                path: "cases/123/alerts",
                performFromQueue: true,
                skipDB: true
              }
            }
          ],
          db: {
            collection: DB_COLLECTIONS_NAMES.RECORDS,
            recordType: RECORD_PATH.cases
          },
          queueAttachments: true,
          queueOffline: true
        }
      };

      expect(actionCreators.saveRecord("cases", "update", body, "123", messageFn)).toEqual(expected);
    });

    it("should return 3 success callback actions if there is a dialogName", () => {
      const expected = [ENQUEUE_SNACKBAR, CLEAR_DIALOG, `${RECORD_PATH.cases}/${FETCH_RECORD_ALERTS}`];

      const successCallbacks = actionCreators
        .saveRecord(RECORD_PATH.cases, "update", body, "123", "Saved Successfully", false, false, false, "testDialog")
        .api.successCallback.map(callback => callback.action);

      expect(Array.isArray(successCallbacks)).toBe(true);
      expect(successCallbacks).toHaveLength(3);
      expect(successCallbacks).toEqual(expected);
    });

    it("should return 4 success callback actions when is an incidentFromCase", () => {
      const expected = [
        ENQUEUE_SNACKBAR,
        `cases/${CLEAR_CASE_FROM_INCIDENT}`,
        RecordFormActions.SET_SELECTED_FORM,
        `${RECORD_PATH.incidents}/${FETCH_RECORD_ALERTS}`
      ];

      const successCallbacks = actionCreators
        .saveRecord(
          RECORD_PATH.incidents,
          "update",
          body,
          "123",
          "Saved Successfully",
          false,
          `/${RECORD_PATH.cases}`,
          false,
          "",
          true
        )
        .api.successCallback.map(callback => callback.action);

      expect(Array.isArray(successCallbacks)).toBe(true);
      expect(successCallbacks).toHaveLength(4);
      expect(successCallbacks).toEqual(expected);
    });

    it("should return 5 success callback actions when incidentPath is included", () => {
      const expected = [
        ENQUEUE_SNACKBAR,
        `cases/${CLEAR_CASE_FROM_INCIDENT}`,
        RecordFormActions.SET_SELECTED_FORM,
        "cases/SET_CASE_ID_REDIRECT",
        `${RECORD_PATH.incidents}/${FETCH_RECORD_ALERTS}`
      ];

      const successCallbacks = actionCreators
        .saveRecord(
          RECORD_PATH.incidents,
          "update",
          body,
          "123",
          "Saved Successfully",
          false,
          `/${RECORD_PATH.cases}`,
          false,
          "",
          true,
          "primeromodule-cp",
          "incident/new"
        )
        .api.successCallback.map(callback => (isObject(callback) ? callback.action : callback));

      expect(Array.isArray(successCallbacks)).toBe(true);
      expect(successCallbacks).toHaveLength(5);
      expect(successCallbacks).toEqual(expected);
      expect(successCallbacks[3]).toEqual("cases/SET_CASE_ID_REDIRECT");
    });
  });

  it("should check the 'fetchRecordsAlerts' action creator to return the correct object", () => {
    const recordId = "123abc";
    const expected = {
      api: {
        path: `${RECORD_PATH.cases}/${recordId}/alerts`,
        skipDB: true,
        performFromQueue: true
      },
      type: `${RECORD_PATH.cases}/FETCH_RECORD_ALERTS`
    };

    expect(actionCreators.fetchRecordsAlerts(RECORD_PATH.cases, recordId)).toEqual(expected);
  });

  it("should check the 'clearMetadata' action creator to return the correct object", () => {
    const expected = {
      type: "TestRecordType/CLEAR_METADATA"
    };

    expect(actionCreators.clearMetadata("TestRecordType")).toEqual(expected);
  });

  it("should check the 'clearCaseFromIncident' action creator to return the correct object", () => {
    const expected = {
      type: "cases/CLEAR_CASE_FROM_INCIDENT"
    };

    expect(actionCreators.clearCaseFromIncident()).toEqual(expected);
  });

  it("should check the 'fetchIncidentFromCase' action creator to return the correct object", () => {
    const expected = {
      type: "cases/FETCH_INCIDENT_FROM_CASE",
      api: {
        path: `cases/case-unique-id-1/incidents/new`,
        successCallback: {
          action: `cases/SET_CASE_ID_FOR_INCIDENT`,
          payload: { caseId: "case-unique-id-1", caseIdDisplay: "case-display-id-1" },
          redirect: "/incidents/module-id-1/new"
        }
      }
    };

    expect(actionCreators.fetchIncidentFromCase("case-unique-id-1", "case-display-id-1", "module-id-1")).toEqual(
      expected
    );
  });

  it("should check the 'setCaseIdForIncident' action creator to return the correct object", () => {
    const expected = {
      type: "cases/SET_CASE_ID_FOR_INCIDENT",
      payload: { caseId: "case-unique-id-1", caseIdDisplay: "case-display-id-1" }
    };

    expect(actionCreators.setCaseIdForIncident("case-unique-id-1", "case-display-id-1")).toEqual(expected);
  });

  it("should check the 'fetchIncidentwitCaseId' action creator to return the correct object", () => {
    const expected = {
      type: "cases/FETCH_INCIDENT_FROM_CASE",
      api: {
        path: "cases/case-id-1/incidents/new"
      }
    };

    expect(actionCreators.fetchIncidentwitCaseId("case-id-1")).toEqual(expected);
  });

  it("should check the 'setSelectedRecord' action creator to return the correct object", () => {
    const recordId = "123abc";

    const expected = {
      type: `${RECORD_PATH.cases}/SET_SELECTED_RECORD`,
      payload: { id: recordId }
    };

    expect(actionCreators.setSelectedRecord(RECORD_PATH.cases, recordId)).toEqual(expected);
  });

  it("should check the 'clearSelectedRecord' action creator to return the correct object", () => {
    const expected = { type: `${RECORD_PATH.cases}/CLEAR_SELECTED_RECORD` };

    expect(actionCreators.clearSelectedRecord(RECORD_PATH.cases)).toEqual(expected);
  });

  it("should check the 'clearRecordAttachments' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/CLEAR_RECORD_ATTACHMENTS`,
      payload: { id: 10, recordType: RECORD_PATH.cases }
    };

    expect(actionCreators.clearRecordAttachments(10, RECORD_PATH.cases)).toEqual(expected);
  });

  it("should check the 'fetchCasesPotentialMatches' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/FETCH_CASES_POTENTIAL_MATCHES`,
      api: { path: "cases/1234/potential_matches" }
    };

    expect(actionCreators.fetchCasesPotentialMatches("1234", RECORD_PATH.cases)).toEqual(expected);
  });

  it("should check the 'fetchTracePotentialMatches' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.tracing_requests}/FETCH_TRACE_POTENTIAL_MATCHES`,
      api: {
        path: `${RECORD_PATH.traces}/12345/potential_matches`
      }
    };

    expect(actionCreators.fetchTracePotentialMatches("12345", RECORD_PATH.tracing_requests)).toEqual(expected);
  });

  it("should check the 'setMachedCaseForTrace' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.tracing_requests}/FETCH_TRACE_POTENTIAL_MATCHES`,
      api: {
        path: `${RECORD_PATH.traces}/12345`,
        method: METHODS.PATCH,
        body: { data: { matched_case_id: "0001" } }
      }
    };

    expect(
      actionCreators.setMachedCaseForTrace({
        traceId: "12345",
        caseId: "0001",
        recordType: RECORD_PATH.tracing_requests
      })
    );
  });

  it("should check the 'fetchTracingRequestTraces' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.tracing_requests}/FETCH_TRACING_REQUEST_TRACES`,
      api: { path: `${RECORD_PATH.tracing_requests}/12345/traces` }
    };

    expect(actionCreators.fetchTracingRequestTraces("12345"));
  });

  it("should check the 'setSelectedCasePotentialMatch' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/SET_CASE_POTENTIAL_MATCH`,
      payload: {
        tracingRequestId: "12345"
      }
    };

    expect(actionCreators.setSelectedCasePotentialMatch("12345", RECORD_PATH.cases)).toEqual(expected);
  });

  it("should check the 'clearSelectedCasePotentialMatch' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/CLEAR_CASE_POTENTIAL_MATCH`
    };

    expect(actionCreators.clearSelectedCasePotentialMatch("12345", RECORD_PATH.tracing_requests)).toEqual(expected);
  });

  it("should check the 'fetchMatchedTraces' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/FETCH_CASE_MATCHED_TRACES`,
      api: {
        path: `${RECORD_PATH.cases}/12345/traces`
      }
    };

    expect(actionCreators.fetchMatchedTraces(RECORD_PATH.cases, "12345")).toEqual(expected);
  });

  it("should check the 'unMatchCaseForTrace' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.tracing_requests}/SET_MACHED_CASE_FOR_TRACE`,
      api: {
        path: `${RECORD_PATH.traces}/12345`,
        method: METHODS.PATCH,
        body: { data: { matched_case_id: null } }
      }
    };

    expect(
      actionCreators.unMatchCaseForTrace({
        traceId: "12345",
        caseId: null,
        recordType: RECORD_PATH.tracing_requests
      })
    );
  });

  it("should check the 'clearPotentialMatches' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/CLEAR_POTENTIAL_MATCHES`
    };

    expect(actionCreators.clearPotentialMatches()).toEqual(expected);
  });

  it("should check the 'externalSync' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/EXTERNAL_SYNC`,
      api: {
        path: `${RECORD_PATH.cases}/12345/sync`,
        method: "POST"
      }
    };

    expect(actionCreators.externalSync(RECORD_PATH.cases, "12345")).toEqual(expected);
  });

  it("should check the 'createCaseFromFamilyMember' action creator to return the correct object", () => {
    const expected = {
      type: "families/CREATE_CASE_FROM_FAMILY_MEMBER",
      api: {
        path: "families/f001/case",
        body: { data: { family_member_id: "m001" } },
        method: "POST",
        successCallback: [
          { action: CLEAR_DIALOG },
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              messageKey: "case.messages.creation_success",
              options: { variant: "success", key: "case-messages-creation-success" }
            }
          }
        ]
      }
    };

    expect(actionCreators.createCaseFromFamilyMember({ familyId: "f001", familyMemberId: "m001" })).toEqual(expected);
  });

  it("checks that 'clearPotentialMatches' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/CLEAR_POTENTIAL_MATCHES`
    };

    expect(actionCreators.clearPotentialMatches()).toEqual(expected);
  });

  it("checks that 'deleteAlertFromRecord' action creator to return the correct object", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/DELETE_ALERT_FROM_RECORD`,
      api: {
        path: `${RECORD_PATH.cases}/12345/alerts/12345-alert`,
        method: METHODS.DELETE,
        skipDB: true,
        performFromQueue: true,
        successCallback: {
          action: `${RECORD_PATH.cases}/DELETE_ALERT_FROM_RECORD_SUCCESS`,
          payload: { alertId: "12345-alert" }
        }
      }
    };

    expect(actionCreators.deleteAlertFromRecord(RECORD_PATH.cases, "12345", "12345-alert")).toEqual(expected);
  });
});
