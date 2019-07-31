import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<RecordSearch /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("searchRecords");
    delete creators.searchRecords;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'searchRecords' action creator to return the correct object", () => {
    const options = "Test";
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.searchRecords({
      namespace: "cases",
      value: "Test"
    })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "cases/SET_RECORD_SEARCH"
    });
  });
});
