import { stub, useFakeTimers } from "../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../action-dialog";
import { FETCH_RECORD_ALERTS } from "../../records/actions";
import { DB_COLLECTIONS_NAMES } from "../../../db";

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
    const clock = useFakeTimers(new Date("10/01/2020"));

    const args = {
      recordType: "cases",
      dialogName: "dialog",
      recordId: 10,
      approvalId: "bia",
      body: { data: { approval_status: "requested" } },
      message: "Updated successfully",
      failureMessage: "updated unsuccessfully",
      messageFromQueue: "Message from queue"
    };

    const expectedAction = {
      type: `cases/${APPROVE_RECORD}`,
      api: {
        path: "cases/10/approvals/bia",
        queueOffline: true,
        responseRecordValues: {
          requested_by: undefined,
          approval_requested_for: "bia",
          approval_date: new Date("10/01/2020")
        },
        responseRecordArray: true,
        responseRecordID: 10,
        responseRecordKey: "approval_subforms",
        responseRecordParams: {
          approval_status_bia: "pending"
        },
        id: 10,
        method: "PATCH",
        body: args.body,
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              messageFromQueue: args.messageFromQueue,
              options: {
                variant: "success",
                key: generate.messageKey(args.message)
              }
            }
          },
          {
            action: CLEAR_DIALOG
          },
          {
            api: {
              path: "cases/10/alerts",
              skipDB: true,
              performFromQueue: true
            },
            action: `cases/${FETCH_RECORD_ALERTS}`
          }
        ],
        db: {
          id: 10,
          collection: DB_COLLECTIONS_NAMES.RECORDS,
          recordType: "cases"
        },
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: generate.messageKey(args.failureMessage)
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
    clock.restore();
  });
});
