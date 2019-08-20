import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("Agencies - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchAgencyLogo");
    delete creators.fetchAgencyLogo;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchAgencyLogo' action creator to return the correct object", () => {
    const expected = { path: "system_settings", params: { extended: true } };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchAgencyLogo()(dispatch);
    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "agencies/FETCH_AGENCY_LOGO"
    );
    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });
});
