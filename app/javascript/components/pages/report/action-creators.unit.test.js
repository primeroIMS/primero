import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actions from "./actions";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators, "DEPRECATED fetchCasesByNationality").to.not.have.property(
      "fetchCasesByNationality"
    );
    expect(creators, "DEPRECATED fetchCasesByNationality").to.not.have.property(
      "fetchCasesByAgeAndSex"
    );
    expect(creators, "DEPRECATED fetchCasesByNationality").to.not.have.property(
      "fetchCasesByProtectionConcern"
    );
    expect(creators, "DEPRECATED fetchCasesByNationality").to.not.have.property(
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
    actionCreators.fetchReport(id)(dispatch);
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(actions.FETCH_REPORT);
    expect(firstCall.returnValue.api.path).to.equal(`reports/${id}`);
  });
});
