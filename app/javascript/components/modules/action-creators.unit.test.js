import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("Modules - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchModules");
    delete creators.fetchModules;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchModules' action creator to return the correct object", () => {
    const expected = { path: "system_settings", params: { extended: true } };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchModules()(dispatch);
    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "modules/FETCH_MODULES"
    );
    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });
});
