import { stub } from "../../../../test";
import { ACCEPTED, REJECTED } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<ReferralAction /> - Action Creators", () => {
  const recordCallback = {
    action: "cases/RECORD",
    api: {
      path: "cases/10",
      db: {
        collection: "records",
        id: "10",
        recordType: "cases"
      },
      failureCallback: [
        {
          action: "cases/REDIRECT",
          redirect: "/cases",
          redirectWithIdFromResponse: false
        }
      ],
      successCallback: [
        {
          action: "cases/REDIRECT",
          redirect: "/cases",
          redirectWithIdFromResponse: true
        }
      ]
    }
  };

  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["referralAccepted", "referralDone", "referralRejected"].forEach(method => {
      expect(creators).to.have.property(method);
      expect(creators[method]).to.be.a("function");
      delete creators[method];
    });

    expect(creators).to.be.empty;
  });

  describe("referralDone action creator", () => {
    const args = {
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      recordId: "10",
      recordType: "cases",
      dialogName: "dialog name",
      transistionId: "20"
    };

    const expectedAction = {
      type: actions.REFERRAL_DONE,
      api: {
        path: `cases/10/referrals/20`,
        method: "DELETE",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                variant: "success",
                key: 4
              }
            }
          },
          {
            action: CLEAR_DIALOG
          },
          recordCallback
        ],
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: 4
              }
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

    beforeEach(() => {
      stub(generate, "messageKey").returns(4);
    });

    afterEach(() => {
      generate.messageKey.restore();
    });

    it("should return the correct action creator", () => {
      expect(actionCreators.referralDone(args)).to.deep.equal(expectedAction);
    });

    context("when a note_on_referral_from_provider is passed", () => {
      it("should return the correct action creator", () => {
        const data = { note_on_referral_from_provider: "some test notes" };

        expectedAction.api = { ...expectedAction.api, body: { data } };

        expect(actionCreators.referralDone({ ...args, data })).to.deep.equal(expectedAction);
      });
    });
  });

  it("should check that 'referralRejected' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      recordId: "10",
      recordType: "cases",
      dialogName: "dialog name",
      transistionId: "20",
      data: { rejected_reason: "reason 1" }
    };

    const expectedAction = {
      type: actions.REFERRAL_REJECTED,
      api: {
        path: `cases/10/referrals/20`,
        method: "PATCH",
        body: { data: { status: REJECTED, rejected_reason: "reason 1" } },
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                variant: "success",
                key: 4
              }
            }
          },
          {
            action: CLEAR_DIALOG
          },
          recordCallback
        ],
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: 4
              }
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

    expect(actionCreators.referralRejected(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });

  it("should check that 'referralAccepted' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      recordId: "10",
      recordType: "cases",
      dialogName: "dialog name",
      transistionId: "20",
      data: { rejected_reason: "reason 1" }
    };

    const expectedAction = {
      type: actions.REFERRAL_ACCEPTED,
      api: {
        path: `cases/10/referrals/20`,
        method: "PATCH",
        body: { data: { status: ACCEPTED } },
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                variant: "success",
                key: 4
              }
            }
          },
          {
            action: CLEAR_DIALOG
          }
        ],
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: 4
              }
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

    expect(actionCreators.referralAccepted(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
