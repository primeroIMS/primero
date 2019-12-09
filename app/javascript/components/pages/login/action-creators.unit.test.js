import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<Login /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("loginSystemSettings");
    delete creators.loginSystemSettings;

    expect(creators).to.deep.equal({});
  });

  // it("should check the 'loginSystemSettings' action creator to return the correct object", () => {
  //   const store = configureStore()({});
  //   const dispatch = sinon.spy(store, "dispatch");

  //   dispatch(
  //     actionCreators.loginSystemSettings()
  //   );
  //   // console.log("return value:::::", dispatch.getCall(0).returnValue)
  //   expect(dispatch.getCall(0).returnValue.type).to.eql("idp/LOGIN");
  //   // expect(dispatch.getCall(0).returnValue.api.body).to.eql({

  //   // });
  // });
});