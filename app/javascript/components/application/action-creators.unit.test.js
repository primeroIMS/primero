import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("Application - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchSystemSettings");
    delete creators.fetchSystemSettings;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchSystemSettings' action creator to return the correct object", () => {
    const expected = { path: "system_settings", params: { extended: true } };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchSystemSettings()(dispatch);
    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "application/FETCH_SYSTEM_SETTINGS"
    );
    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });
});
