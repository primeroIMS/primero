import sinon from "sinon";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";

import * as actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<Nav /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["openDrawer", "fetchAlerts"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });
    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchAlerts' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchAlerts());

    expect(dispatch.getCall(0).returnValue.type).to.eql(actions.FETCH_ALERTS);
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(RECORD_PATH.alerts);
  });
});
