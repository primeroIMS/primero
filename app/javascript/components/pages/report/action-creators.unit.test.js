import clone from "lodash/clone";
import chai, { expect } from "chai";
import configureStore from "redux-mock-store";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import * as actions from "./actions";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.not.have.property("fetchCasesByNationality");
    expect(creators).to.not.have.property("fetchCasesByAgeAndSex");
    expect(creators).to.not.have.property("fetchCasesByProtectionConcern");
    expect(creators).to.not.have.property("fetchCasesByAgency");
    expect(creators).to.have.property("fetchReport");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReport;

    expect(creators).to.deep.equal({});
  });

  describe("deprecated 'fetchCasesByNationality'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByNationality).to.be.equal(undefined);
    });
  });

  describe("deprecated 'fetchCasesByAgeAndSex'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByAgeAndSex).to.be.equal(undefined);
    });
  });

  describe("deprecated 'fetchCasesByProtectionConcern'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByProtectionConcern).to.be.equal(
        undefined
      );
    });
  });

  describe("deprecated 'fetchCasesByAgency'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByAgency).to.be.equal(undefined);
    });
  });

  it("should check the 'fetchReport' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const id = 1234;
    actionCreators.fetchReport(id)(dispatch);
    const result = dispatch.getCall(0);

    expect(result.returnValue.type).to.equal(actions.FETCH_REPORT);
    expect(result.returnValue.api.path).to.equal(`reports/${id}`);
  });
});
