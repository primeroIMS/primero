import { stub } from "../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";

import * as actionCreators from "./action-creators";
import { APPROVE_RECORD } from "./actions";

describe("<RequestApproval /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("approvalRecord");
    delete creators.approvalRecord;

    expect(creators).to.deep.equal({});
  });

  it("should check that 'approvalRecord' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      recordType: "cases",
      dialogName: "dialog",
      recordId: 10,
      approvalId: "bia",
      body: { data: { approval_status: "requested" } },
      message: "Updated successfully",
      failureMessage: "updated unsuccessfully"
    };

    const expectedAction = {
      type: `cases/${APPROVE_RECORD}`,
      api: {
        path: "cases/10/approvals/bia",
        method: "PATCH",
        body: args.body,
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                variant: "success",
                key: generate.messageKey()
              }
            }
          },
          {
            action: SET_DIALOG,
            payload: {
              dialog: args.dialogName,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ],
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: generate.messageKey()
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

    expect(actionCreators.approvalRecord(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
