// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG } from "../../action-dialog";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<Transitions /> - Action Creators", () => {
  beforeAll(() => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);
  });

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).toHaveProperty("fetchAssignUsers");
    expect(creators).toHaveProperty("removeFormErrors");
    expect(creators).toHaveProperty("saveAssignedUser");
    expect(creators).toHaveProperty("saveTransferUser");
    expect(creators).toHaveProperty("fetchTransferUsers");
    // DEPRECATED fetchTransitionData
    expect(creators).not.toHaveProperty("fetchTransitionData");
    expect(creators).toHaveProperty("fetchReferralUsers");
    expect(creators).toHaveProperty("saveReferral");
    delete creators.fetchAssignUsers;
    delete creators.removeFormErrors;
    delete creators.saveAssignedUser;
    delete creators.saveTransferUser;
    delete creators.fetchTransferUsers;
    delete creators.fetchTransitionData;
    delete creators.fetchReferralUsers;
    delete creators.saveReferral;
    delete creators.resetReferralSuccess;

    expect(creators).toEqual({});
  });

  it("should check the 'fetchAssignUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchAssignUsers());
    const firstCallReturnValue = dispatch.mock.calls[0][0];

    expect(firstCallReturnValue.type).toBe(actions.ASSIGN_USERS_FETCH);
    expect(firstCallReturnValue.api.path).toBe("users/assign-to");
  });

  it("should check the 'fetchTransferUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchTransferUsers());
    const firstCallReturnValue = dispatch.mock.calls[0][0];

    expect(firstCallReturnValue.type).toBe(actions.TRANSFER_USERS_FETCH);
    expect(firstCallReturnValue.api.path).toBe("users/transfer-to");
  });

  it("should check the 'removeFormErrors' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.removeFormErrors("reassign"));

    expect(dispatch).toHaveBeenCalledWith({
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
    const dispatch = jest.spyOn(store, "dispatch");
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
            action: CLEAR_DIALOG
          }
        ]
      }
    };

    expect(dispatch(actionCreators.saveAssignedUser("cases", "123abc", body, "Success Message"))).toEqual(expected);
  });

  it("should check the 'saveTransferUser' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_user_mgr_cp",
        notes: "Some transfer notes"
      }
    };
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
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
            action: CLEAR_DIALOG
          }
        ]
      }
    };

    expect(dispatch(actionCreators.saveTransferUser("123abc", body, "Success Message"))).toEqual(expected);
  });

  it("should check the 'fetchReferralUsers' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchReferralUsers());

    expect(dispatch.mock.calls[0][0].type).toBe(actions.REFERRAL_USERS_FETCH);
    expect(dispatch.mock.calls[0][0].api.path).toBe("users/refer-to");
  });

  it("should check the 'saveReferral' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_cp",
        notes: "Some referral notes"
      }
    };
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
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
            action: CLEAR_DIALOG
          }
        ]
      }
    };

    expect(dispatch(actionCreators.saveReferral("123abc", "cases", body, "Success Message"))).toEqual(expected);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
