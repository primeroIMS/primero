import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import { normalizeData } from "schemas";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<Transitions /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchAssignUsers");
    expect(creators).to.have.property("removeFormErrors");
    expect(creators).to.have.property("saveAssignedUser");
    delete creators.fetchAssignUsers;
    delete creators.removeFormErrors;
    delete creators.saveAssignedUser;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchAssignUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchAssignUsers()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "transitions/ASSIGN_USERS_FETCH"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("users/assign-to");
  });

  it("should check the 'removeFormErrors' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "removeFormErrors");
    actionCreators.removeFormErrors("reassign");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "transitions/CLEAR_ERRORS",
      payload: "reassign"
    });
  });

  it("should check the 'saveAssignedUser' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_cp",
        notes: "Some notes"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.saveAssignedUser("123abc", body, "Success Message")(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "transitions/ASSIGN_USER_SAVE"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("cases/123abc/assigns");
    expect(dispatch.getCall(0).returnValue.api.method).to.eql("POST");
    expect(dispatch.getCall(0).returnValue.api.body).to.eql(body);
    expect(dispatch.getCall(0).returnValue.api.successCallback.action).to.eql(
      "notifications/ENQUEUE_SNACKBAR"
    );
    expect(
      dispatch.getCall(0).returnValue.api.successCallback.payload.message
    ).to.eql("Success Message");
  });
});
