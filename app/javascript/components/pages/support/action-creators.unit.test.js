import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<Support /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchData");
    delete creators.fetchData;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchData' action creator to return the correct object", () => {
    const store = configureStore()({});
    let dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchData()(dispatch);
    expect(dispatch).to.have.been.calledWithMatch({
      api: {
        path: "contact_information"
      },
      type: actions.FETCH_DATA
    });
  });
});