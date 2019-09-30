import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<Login /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("attemptLogin");
    delete creators.attemptLogin;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'attemptLogin' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.attemptLogin({ user_name: "primero", password: "test" })(
      dispatch
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
