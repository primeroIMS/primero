import clone from "lodash/clone";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import * as Actions from "./actions";

describe("<Transitions /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchTransitions");
    delete creators.fetchTransitions;
    expect(creators).to.deep.equal({});
  });
  it("should check the 'fetchTransitions' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const actions = { ...Actions };

    actionCreators.fetchTransitions(recordType, record)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      actions.FETCH_TRANSITIONS
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(
      "cases/d6a6dbb4-e5e9-4720-a661-e181a12fd3a0/transitions"
    );
  });
});
