import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { RECORD_PATH } from "../../config/constants";
import { ENQUEUE_SNACKBAR } from "../notifier";
import { CLEAR_DIALOG } from "../action-dialog";
import RecordFormActions from "../record-form/actions";

import * as actionCreators from "./action-creators";
import { CLEAR_CASE_FROM_INCIDENT, FETCH_RECORD_ALERTS } from "./actions";

describe("records - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators, "DEPRECATED setFilters").to.not.have.property("setFilters");
    expect(creators, "DEPRECATED fetchCases").to.not.have.property("fetchCases");
    expect(creators, "DEPRECATED fetchIncidents").to.not.have.property("fetchIncidents");
    expect(creators, "DEPRECATED fetchTracingRequests").to.not.have.property("fetchTracingRequests");
    expect(creators).to.have.property("fetchRecord");
    expect(creators).to.have.property("saveRecord");
    expect(creators).to.have.property("fetchRecordsAlerts");
    expect(creators).to.have.property("clearMetadata");
    expect(creators).to.have.property("clearCaseFromIncident");
    expect(creators).to.have.property("fetchIncidentFromCase");
    expect(creators).to.have.property("fetchIncidentwitCaseId");
    expect(creators).to.have.property("setCaseIdForIncident");
    delete creators.setFilters;
    delete creators.fetchCases;
    delete creators.fetchIncidents;
    delete creators.fetchTracingRequests;
    delete creators.fetchRecord;
    delete creators.fetchRecordsAlerts;
    delete creators.clearMetadata;
    delete creators.saveRecord;
    delete creators.clearCaseFromIncident;
    delete creators.fetchIncidentFromCase;
    delete creators.fetchIncidentwitCaseId;
    delete creators.setCaseIdForIncident;

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchRecord' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store.dispatch(actionCreators.fetchRecord("cases", "123")).then(() => {
      const actions = store.getActions();

      expect(actions[0].type).to.eql("cases/RECORD");
      expect(actions[0].api.path).to.eql("cases/123");
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
      const store = configureStore([thunk])({});

      return store.dispatch(actionCreators.saveRecord("cases", "update", body, "123", () => {})).then(() => {
        const actions = store.getActions();

        expect(actions[0].type).to.eql("cases/SAVE_RECORD");
        expect(actions[0].api.path).to.eql("cases/123");
        expect(actions[0].api.method).to.eql("PATCH");
        expect(actions[0].api.body).to.eql(body);
      });
    });

    it("when path it's not 'update', the path and method should be different", () => {
      const store = configureStore([thunk])({});

      return store.dispatch(actionCreators.saveRecord("cases", "update", body, "123", () => {})).then(() => {
        const actions = store.getActions();

        expect(actions[0].type).to.eql("cases/SAVE_RECORD");
        expect(actions[0].api.path).to.eql("cases/123");
        expect(actions[0].api.method).to.eql("PATCH");
        expect(actions[0].api.body).to.eql(body);
      });
    });

    it("should return 3 success callback actions if there is a dialogName", () => {
      const store = configureStore([thunk])({});
      const expected = [ENQUEUE_SNACKBAR, CLEAR_DIALOG, `${RECORD_PATH.cases}/${FETCH_RECORD_ALERTS}`];

      return store
        .dispatch(
          actionCreators.saveRecord(
            RECORD_PATH.cases,
            "update",
            body,
            "123",
            "Saved Successfully",
            false,
            false,
            false,
            "testDialog"
          )
        )
        .then(() => {
          const successCallbacks = store.getActions()[0].api.successCallback;

          expect(successCallbacks).to.be.an("array");
          expect(successCallbacks).to.have.lengthOf(3);
          expect(successCallbacks.map(({ action }) => action)).to.deep.equals(expected);
        });
    });

    it("should return 3 success callback actions when is an incidentFromCase", () => {
      const store = configureStore([thunk])({});
      const expected = [
        ENQUEUE_SNACKBAR,
        `cases/${CLEAR_CASE_FROM_INCIDENT}`,
        RecordFormActions.SET_SELECTED_FORM,
        `${RECORD_PATH.incidents}/${FETCH_RECORD_ALERTS}`
      ];

      return store
        .dispatch(
          actionCreators.saveRecord(
            RECORD_PATH.incidents,
            "update",
            body,
            "123",
            "Saved Successfully",
            false,
            false,
            false,
            "",
            true
          )
        )
        .then(() => {
          const successCallbacks = store.getActions()[0].api.successCallback;

          expect(successCallbacks).to.be.an("array");
          expect(successCallbacks).to.have.lengthOf(4);
          expect(successCallbacks.map(({ action }) => action)).to.deep.equals(expected);
        });
    });

    it("should return 6 success callback actions when incidentPath is included", () => {
      const store = configureStore([thunk])({});
      const expected = [
        ENQUEUE_SNACKBAR,
        `cases/${CLEAR_CASE_FROM_INCIDENT}`,
        RecordFormActions.SET_SELECTED_FORM,
        undefined,
        "forms/SET_SELECTED_FORM",
        `${RECORD_PATH.incidents}/${FETCH_RECORD_ALERTS}`
      ];

      return store
        .dispatch(
          actionCreators.saveRecord(
            RECORD_PATH.incidents,
            "update",
            body,
            "123",
            "Saved Successfully",
            false,
            false,
            false,
            "",
            true,
            "primeromodule-cp",
            "incident/new"
          )
        )
        .then(() => {
          const successCallbacks = store.getActions()[0].api.successCallback;

          expect(successCallbacks).to.be.an("array");
          expect(successCallbacks).to.have.lengthOf(6);
          expect(successCallbacks.map(({ action }) => action)).to.deep.equals(expected);
          expect(successCallbacks[3]).to.eql("cases/SET_CASE_ID_REDIRECT");
        });
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

    expect(actionCreators.fetchRecordsAlerts(RECORD_PATH.cases, recordId)).be.deep.equals(expected);
  });

  it("should check the 'clearMetadata' action creator to return the correct object", () => {
    const expected = {
      type: "TestRecordType/CLEAR_METADATA"
    };

    expect(actionCreators.clearMetadata("TestRecordType")).be.deep.equals(expected);
  });

  it("should check the 'clearCaseFromIncident' action creator to return the correct object", () => {
    const expected = {
      type: "cases/CLEAR_CASE_FROM_INCIDENT"
    };

    expect(actionCreators.clearCaseFromIncident()).be.deep.equals(expected);
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

    expect(actionCreators.fetchIncidentFromCase("case-unique-id-1", "case-display-id-1", "module-id-1")).be.deep.equals(
      expected
    );
  });

  it("should check the 'setCaseIdForIncident' action creator to return the correct object", () => {
    const expected = {
      type: "cases/SET_CASE_ID_FOR_INCIDENT",
      payload: { caseId: "case-unique-id-1", caseIdDisplay: "case-display-id-1" }
    };

    expect(actionCreators.setCaseIdForIncident("case-unique-id-1", "case-display-id-1")).to.deep.equal(expected);
  });

  it("should check the 'fetchIncidentwitCaseId' action creator to return the correct object", () => {
    const expected = {
      type: "cases/FETCH_INCIDENT_FROM_CASE",
      api: {
        path: "cases/case-id-1/incidents/new"
      }
    };

    expect(actionCreators.fetchIncidentwitCaseId("case-id-1")).to.deep.equal(expected);
  });
});
