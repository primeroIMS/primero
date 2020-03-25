import clone from "lodash/clone";
import configureStore from "redux-mock-store";
import sinon from "sinon";

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { expect, stub } from "../../../test/unit-test-helpers";
import { ASSIGN_DIALOG, TRANSFER_DIALOG, REFER_DIALOG } from "../constants";

import * as actionCreators from "./action-creators";
import actions from "./actions";

import { SET_DIALOG, SET_DIALOG_PENDING } from "..";

describe("<Transitions /> - Action Creators", () => {
  before(() => {
    stub(generate, "messageKey").returns(4);
  });

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchAssignUsers");
    expect(creators).to.have.property("removeFormErrors");
    expect(creators).to.have.property("saveAssignedUser");
    expect(creators).to.have.property("saveTransferUser");
    expect(creators).to.have.property("fetchTransferUsers");
    expect(creators, "DEPRECATED fetchTransitionData").to.not.have.property(
      "fetchTransitionData"
    );
    expect(creators).to.have.property("fetchReferralUsers");
    expect(creators).to.have.property("saveReferral");
    delete creators.fetchAssignUsers;
    delete creators.removeFormErrors;
    delete creators.saveAssignedUser;
    delete creators.saveTransferUser;
    delete creators.fetchTransferUsers;
    delete creators.fetchTransitionData;
    delete creators.fetchReferralUsers;
    delete creators.saveReferral;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchAssignUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchAssignUsers());
    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.equal(actions.ASSIGN_USERS_FETCH);
    expect(firstCallReturnValue.api.path).to.equal("users/assign-to");
  });

  it("should check the 'fetchTransferUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchTransferUsers());
    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.equal(actions.TRANSFER_USERS_FETCH);
    expect(firstCallReturnValue.api.path).to.equal("users/transfer-to");
  });

  it("should check the 'removeFormErrors' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "removeFormErrors");

    actionCreators.removeFormErrors("reassign");

    expect(dispatch.getCall(0).returnValue).to.deep.equal({
      type: actions.CLEAR_ERRORS,
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
    const expected = {
      type: actions.ASSIGN_USER_SAVE,
      api: {
        body,
        method: "POST",
        path: "cases/123abc/assigns",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: "Success Message",
              options: {
                key: 4,
                variant: "success"
              }
            }
          },
          {
            action: SET_DIALOG,
            payload: {
              dialog: ASSIGN_DIALOG,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ]
      }
    };

    expect(
      dispatch(
        actionCreators.saveAssignedUser("123abc", body, "Success Message")
      )
    ).to.deep.equals(expected);
  });

  it("should check the 'saveTransferUser' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_user_mgr_cp",
        notes: "Some transfer notes"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const expected = {
      type: actions.TRANSFER_USER,
      api: {
        body,
        method: "POST",
        path: "cases/123abc/transfers",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: "Success Message",
              options: {
                key: 4,
                variant: "success"
              }
            }
          },
          {
            action: SET_DIALOG,
            payload: {
              dialog: TRANSFER_DIALOG,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ]
      }
    };

    expect(
      dispatch(
        actionCreators.saveTransferUser("123abc", body, "Success Message")
      )
    ).to.deep.equals(expected);
  });

  it("should check the 'fetchReferralUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchReferralUsers());

    expect(dispatch.getCall(0).returnValue.type).to.equal(
      actions.REFERRAL_USERS_FETCH
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.equal("users/refer-to");
  });

  it("should check the 'saveReferral' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_cp",
        notes: "Some referral notes"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const expected = {
      type: actions.REFER_USER,
      api: {
        body,
        method: "POST",
        path: "cases/123abc/referrals",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: "Success Message",
              options: {
                key: 4,
                variant: "success"
              }
            }
          },
          {
            action: SET_DIALOG,
            payload: {
              dialog: REFER_DIALOG,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ]
      }
    };

    expect(
      dispatch(
        actionCreators.saveReferral("123abc", "cases", body, "Success Message")
      )
    ).to.deep.equals(expected);
  });

  after(() => {
    generate.messageKey.restore();
  });
});
