import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<TransferApproval /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("approvalTransfer");
    delete creators.approvalTransfer;

    expect(creators).toEqual({});
  });

  it("should refetch the record when the transfer is accepted", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      recordId: "10",
      recordType: "cases",
      approvalId: "bia",
      body: { data: { status: "accepted" } },
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      dialogName: "dialog name",
      transferId: "20"
    };

    const expectedAction = {
      type: actions.APPROVE_TRANSFER,
      api: {
        path: "cases/10/transfers/20",
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
            }
          },
          {
            action: CLEAR_DIALOG
          },
          {
            action: "cases/RECORD",
            api: {
              path: "cases/10",
              db: { collection: "records", recordType: "cases", id: "10" }
            }
          },
          {
            action: "cases/REDIRECT",
            redirectProperty: "record_id",
            redirectWithIdFromResponse: true,
            redirectWhenAccessDenied: true,
            redirect: "/cases"
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

    expect(actionCreators.approvalTransfer(args)).toEqual(expectedAction);

    jest.resetAllMocks();
  });

  it("should not refetch the record when the transfer is rejected", () => {
    const action = actionCreators.approvalTransfer({
      recordId: "10",
      recordType: "cases",
      body: { data: { status: "rejected", rejected_reason: "reason" } },
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      transferId: "20"
    });

    expect(action.api.successCallback.map(callback => callback.action)).toEqual([
      ENQUEUE_SNACKBAR,
      CLEAR_DIALOG,
      "cases/REDIRECT"
    ]);
  });
});
