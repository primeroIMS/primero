import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import { FETCH_REPORT } from "./actions";

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

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReport;

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchReport' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const id = 1234;

    dispatch(actionCreators.fetchReport(id));
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(FETCH_REPORT);
    expect(firstCall.returnValue.api.path).to.equal(`reports/${id}`);
  });
});
