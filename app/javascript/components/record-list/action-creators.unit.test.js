import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("CaseList - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setFilters");
    delete creators.setFilters;

    expect(creators).to.have.property("fetchCases");
    delete creators.fetchCases;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setFilters' action creator to return the correct object", () => {
    const input = { gender: "male" };
    const expected = {
      type: actions.SET_FILTERS,
      payload: { gender: "male" }
    };
    expect(actionCreators.setFilters(input)).to.deep.equal(expected);
  });

  it("should check the 'fetchCases' action creator to return the correct object", () => {
    const options = { status: "open" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchCases({ status: "open" })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: actions.SET_FILTERS
    });

    expect(dispatch).to.have.been.calledWithMatch({
      api: { params: options, path: "/cases" },
      type: "CASES"
    });
  });
});
