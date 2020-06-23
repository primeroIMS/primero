import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { RECORD_PATH } from "../../config/constants";
import { ENQUEUE_SNACKBAR } from "../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../record-actions/actions";

import * as actionCreators from "./action-creators";

describe("records - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators, "DEPRECATED setFilters").to.not.have.property(
      "setFilters"
    );
    expect(creators, "DEPRECATED fetchCases").to.not.have.property(
      "fetchCases"
    );
    expect(creators, "DEPRECATED fetchIncidents").to.not.have.property(
      "fetchIncidents"
    );
    expect(creators, "DEPRECATED fetchTracingRequests").to.not.have.property(
      "fetchTracingRequests"
    );
    expect(creators).to.have.property("fetchRecord");
    expect(creators).to.have.property("saveRecord");
    expect(creators).to.have.property("fetchRecordsAlerts");
    delete creators.setFilters;
    delete creators.fetchCases;
    delete creators.fetchIncidents;
    delete creators.fetchTracingRequests;
    delete creators.fetchRecord;
    delete creators.fetchRecordsAlerts;
    delete creators.saveRecord;

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchRecord' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store
      .dispatch(actionCreators.fetchRecord("cases", "123"))
      .then(() => {
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

      return store
        .dispatch(
          actionCreators.saveRecord("cases", "update", body, "123", () => {})
        )
        .then(() => {
          const actions = store.getActions();

          expect(actions[0].type).to.eql("cases/SAVE_RECORD");
          expect(actions[0].api.path).to.eql("cases/123");
          expect(actions[0].api.method).to.eql("PATCH");
          expect(actions[0].api.body).to.eql(body);
        });
    });

    it("when path it's not 'update', the path and method should be different", () => {
      const store = configureStore([thunk])({});

      return store
        .dispatch(
          actionCreators.saveRecord("cases", "update", body, "123", () => {})
        )
        .then(() => {
          const actions = store.getActions();

          expect(actions[0].type).to.eql("cases/SAVE_RECORD");
          expect(actions[0].api.path).to.eql("cases/123");
          expect(actions[0].api.method).to.eql("PATCH");
          expect(actions[0].api.body).to.eql(body);
        });
    });

    it("should return 3 success callback actions if there is a dialogName", () => {
      const store = configureStore([thunk])({});
      const expected = [ENQUEUE_SNACKBAR, SET_DIALOG, SET_DIALOG_PENDING];

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
          expect(successCallbacks.map(({ action }) => action)).to.deep.equals(
            expected
          );
        });
    });
  });

  it("should check the 'fetchRecordsAlerts' action creator to return the correct object", () => {
    const recordId = "123abc";
    const expected = {
      api: {
        path: `${RECORD_PATH.cases}/${recordId}/alerts`
      },
      type: `${RECORD_PATH.cases}/FETCH_RECORD_ALERTS`
    };

    expect(
      actionCreators.fetchRecordsAlerts(RECORD_PATH.cases, recordId)
    ).be.deep.equals(expected);
  });
});
