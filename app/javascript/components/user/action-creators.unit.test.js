import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("User - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setUser");
    expect(creators).to.have.property("fetchAuthenticatedUserData");
    expect(creators).to.have.property("setAppSettingsFetched");
    expect(creators).to.have.property("setAuthenticatedUser");
    expect(creators).to.have.property("attemptSignout");
    expect(creators).to.have.property("checkUserAuthentication");
    expect(creators).to.have.property("refreshToken");
    delete creators.setUser;
    delete creators.fetchAuthenticatedUserData;
    delete creators.setAppSettingsFetched;
    delete creators.setAuthenticatedUser;
    delete creators.attemptSignout;
    delete creators.checkUserAuthentication;
    delete creators.refreshToken;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setAppSettingsFetched' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.setAppSettingsFetched(false)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "application/APP_SETTINGS_FETCHED"
    );
  });

  it("should check the 'setAuthenticatedUser' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.setAuthenticatedUser(false)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "user/SET_AUTHENTICATED_USER"
    );
  });
});
