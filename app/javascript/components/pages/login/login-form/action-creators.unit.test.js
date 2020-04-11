import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<LoginForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("attemptLogin");
    delete creators.attemptLogin;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'attemptLogin' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(
      actionCreators.attemptLogin({ user_name: "primero", password: "test" })
    );

    expect(dispatch.getCall(0).returnValue.type).to.eql("user/LOGIN");
    expect(dispatch.getCall(0).returnValue.api.body).to.eql({
      user: {
        password: "test",
        user_name: "primero"
      }
    });
  });
});
