import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import * as actions from "./actions";

describe("<Support /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("fetchData");
    delete creators.fetchData;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchData' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchData());
    expect(dispatch).to.have.been.calledWithMatch({
      api: {
        path: "contact_information"
      },
      type: actions.FETCH_DATA
    });
  });
});
