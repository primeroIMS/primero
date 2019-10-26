import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

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
    actionCreators.fetchReports(data)(dispatch);
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(actions.FETCH_REPORTS);
    expect(firstCall.returnValue.api.path).to.equal("reports");
    expect(firstCall.returnValue.api.params).to.deep.equal(data.options);
  });
});
