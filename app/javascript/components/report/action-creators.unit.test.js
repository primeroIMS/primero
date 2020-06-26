import sinon from "sinon";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";
import { stub } from "../../test";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators, "DEPRECATED fetchCasesByNationality").to.not.have.property(
      "fetchCasesByNationality"
    );
    expect(creators, "DEPRECATED fetchCasesByAgeAndSex").to.not.have.property(
      "fetchCasesByAgeAndSex"
    );
    expect(
      creators,
      "DEPRECATED fetchCasesByProtectionConcern"
    ).to.not.have.property("fetchCasesByProtectionConcern");
    expect(creators, "DEPRECATED fetchCasesByAgency").to.not.have.property(
      "fetchCasesByAgency"
    );
    expect(creators).to.have.property("fetchReport");
    expect(creators).to.have.property("deleteReport");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReport;
    delete creators.deleteReport;

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchReport' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const id = 1234;

    dispatch(actionCreators.fetchReport(id));
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(actions.FETCH_REPORT);
    expect(firstCall.returnValue.api.path).to.equal(`reports/${id}`);
  });

  it("should check that 'deleteRole' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      id: 1,
      message: "Deleted successfully"
    };

    const expectedAction = {
      type: actions.DELETE_REPORT,
      api: {
        path: `${RECORD_PATH.reports}/1`,
        method: "DELETE",
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: "Deleted successfully",
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/${RECORD_PATH.reports}`
        }
      }
    };

    expect(actionCreators.deleteReport(args)).to.deep.equal(expectedAction);
  });
});
