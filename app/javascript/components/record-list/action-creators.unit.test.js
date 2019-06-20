import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("RecordList - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchRecords");
    delete creators.fetchRecords;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchRecords' action creator to return the correct object", () => {
    const options = { status: "open" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchRecords({
      options: { status: "open" },
      namespace: "cases",
      path: "/cases"
    })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: `cases/${actions.SET_FILTERS}`
    });

    expect(dispatch).to.have.been.calledWithMatch({
      api: { params: options, path: "/cases" },
      type: "cases/RECORDS"
    });
  });
});
