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

    expect(creators).to.have.property("setStyle");
    expect(creators).to.have.property("setAuth");
    expect(creators).to.have.property("loadResources");
    expect(creators).to.have.property("attemptLogin");
    expect(creators).to.have.property("attemptSignout");
    expect(creators).to.have.property("checkAuthentication");
    delete creators.setStyle;
    delete creators.setAuth;
    delete creators.loadResources;
    delete creators.attemptLogin;
    delete creators.attemptSignout;
    delete creators.checkAuthentication;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setStyle' action creator to return the correct object", () => {
    const options = { module: "gbv", agency: "unicef" };
    const dispatch = sinon.spy(actionCreators, "setStyle");
    actionCreators.setStyle({
      module: "gbv",
      agency: "unicef"
    });

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "user/SET_STYLE",
      payload: options
    });
  });

  it("should check the 'setAuth' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setAuth");
    actionCreators.setAuth(false);

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "user/SET_AUTH",
      payload: false
    });
  });

  it("should check the 'loadResources' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "loadResources");
    actionCreators.loadResources();

    expect(typeof dispatch.getCall(0).returnValue).to.eql("function");
  });

  it("should check the 'attemptLogin' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.attemptLogin({ user_name: "primero", password: "test" })(dispatch);
    expect(dispatch.getCall(0).returnValue.type).to.eql("user/LOGIN");
    expect(dispatch.getCall(0).returnValue.api.body).to.eql({
      user: {
        password: "test",
        user_name: "primero"
      }
    });
  });

  it("should check the 'attemptSignout' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.attemptSignout()(dispatch);
    expect(dispatch.getCall(0).returnValue.type).to.eql("user/LOGOUT");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("tokens");
    expect(dispatch.getCall(0).returnValue.api.method).to.eql("DELETE");
  });

  it("should check the 'checkAuthentication' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "checkAuthentication");
    actionCreators.checkAuthentication();
    expect(typeof dispatch.getCall(0).returnValue).to.eql("function");
  });
});
