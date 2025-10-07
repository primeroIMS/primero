// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { METHODS, RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../../../notifier";
import { CLEAR_DIALOG } from "../../../action-dialog";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    [
      "fetchUser",
      "saveUser",
      "clearSelectedUser",
      "clearRecordsUpdate",
      "newPasswordResetRequest",
      "passwordResetRequest"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_USER,
      api: {
        path: `${RECORD_PATH.users}/10`
      }
    };

    expect(actionsCreators.fetchUser(10)).toEqual(expectedAction);
  });

  describe("saveUser", () => {
    beforeEach(() => {
      jest.spyOn(generate, "messageKey").mockReturnValue(4);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should check that returns the correct object", () => {
      const args = {
        id: 10,
        body: {
          prop1: "prop-1"
        },
        saveMethod: "update",
        message: "Updated successfully",
        failureMessage: "Updated unsuccessfully",
        dialogName: "dialog"
      };

      const expectedAction = {
        type: actions.SAVE_USER,
        api: {
          path: `${RECORD_PATH.users}/10`,
          method: "PATCH",
          body: args.body,
          successCallback: [
            {
              action: ENQUEUE_SNACKBAR,
              payload: {
                message: args.message,
                options: {
                  key: 4,
                  variant: "success"
                }
              },
              redirectWithIdFromResponse: false,
              redirect: `/admin/${RECORD_PATH.users}/10`
            },
            {
              action: CLEAR_DIALOG
            },
            {
              action: actions.RECORDS_UPDATE,
              payload: false
            }
          ]
        }
      };

      expect(actionsCreators.saveUser(args)).toEqual(expectedAction);
    });
  });

  describe("newPasswordResetRequest", () => {
    beforeEach(() => {
      jest.spyOn(generate, "messageKey").mockReturnValue("user.password_reset.request_submitted");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return the correct object", () => {
      const email = "user@example.com";
      const expected = {
        type: actions.NEW_PASSWORD_RESET_REQUEST,
        api: {
          path: "users/password-reset-request",
          method: METHODS.POST,
          body: { user: { email } },
          successCallback: [
            {
              action: ENQUEUE_SNACKBAR,
              payload: {
                messageKey: "user.password_reset.request_submitted",
                options: {
                  variant: SNACKBAR_VARIANTS.success,
                  key: "user.password_reset.request_submitted"
                }
              }
            },
            {
              action: CLEAR_DIALOG
            }
          ]
        }
      };

      expect(actionsCreators.newPasswordResetRequest(email)).toEqual(expected);
    });
  });

  describe("passwordResetRequest", () => {
    beforeEach(() => {
      jest.spyOn(generate, "messageKey").mockReturnValue("user.password_reset.request_submitted");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should check that returns the correct object", () => {
      const expectedAction = {
        type: actions.PASSWORD_RESET_REQUEST,
        api: {
          path: "users/5/password-reset-request",
          method: METHODS.POST,
          body: { user: { password_reset: true } },
          successCallback: [
            {
              action: ENQUEUE_SNACKBAR,
              payload: {
                messageKey: "user.password_reset.request_submitted",
                options: {
                  variant: SNACKBAR_VARIANTS.success,
                  key: "user.password_reset.request_submitted"
                }
              }
            },
            {
              action: CLEAR_DIALOG
            }
          ]
        }
      };

      expect(actionsCreators.passwordResetRequest(5)).toEqual(expectedAction);
    });
  });
});
