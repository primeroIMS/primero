import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import { FETCH_REPORTS } from "./actions";

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
    expect(creators).to.have.property("fetchReports");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReports;

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchReports' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const data = { options: { page: 1, per: 20 } };

    dispatch(actionCreators.fetchReports(data));
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(FETCH_REPORTS);
    expect(firstCall.returnValue.api.path).to.equal("reports");
    expect(firstCall.returnValue.api.params).to.deep.equal(data.options);
  });
});
