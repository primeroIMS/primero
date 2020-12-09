import { stub } from "../../../../test";
import { METHODS, RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../../../notifier";
import { CLEAR_DIALOG } from "../../../action-dialog";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUser", "saveUser", "clearSelectedUser", "newPasswordResetRequest", "passwordResetRequest"].forEach(
      property => {
        expect(creators).to.have.property(property);
        delete creators[property];
      }
    );

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_USER,
      api: {
        path: `${RECORD_PATH.users}/10`
      }
    };

    expect(actionsCreators.fetchUser(10)).to.deep.equal(expectedAction);
  });

  describe("saveUser", () => {
    beforeEach(() => {
      stub(generate, "messageKey").returns(4);
    });

    afterEach(() => {
      generate.messageKey.restore();
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
            }
          ]
        }
      };

      expect(actionsCreators.saveUser(args)).to.deep.equal(expectedAction);
    });
  });

  describe("newPasswordResetRequest", () => {
    beforeEach(() => {
      stub(generate, "messageKey").returns("user.password_reset.request_submitted");
    });

    afterEach(() => {
      generate.messageKey.restore();
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

      expect(actionsCreators.newPasswordResetRequest(email)).to.deep.equal(expected);
    });
  });

  describe("passwordResetRequest", () => {
    beforeEach(() => {
      stub(generate, "messageKey").returns("user.password_reset.request_submitted");
    });

    afterEach(() => {
      generate.messageKey.restore();
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

      expect(actionsCreators.passwordResetRequest(5)).to.deep.equal(expectedAction);
    });
  });
});
