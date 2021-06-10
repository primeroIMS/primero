import { stub } from "../../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<TransferApproval /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("approvalTransfer");
    delete creators.approvalTransfer;

    expect(creators).to.deep.equal({});
  });

  it("should check that 'approvalTransfer' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

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

    expect(actionCreators.approvalTransfer(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
