import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("ChangeLogs - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchChangeLogs"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchChangeLogs' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";

    actionCreators.fetchChangeLogs(recordType, record)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      actions.FETCH_CHANGE_LOGS
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(
      `${recordType}/${record}/record_history`
    );
  });
});
