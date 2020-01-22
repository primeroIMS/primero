import { expect, stub } from "../../../test/unit-test-helpers";
import { RECORD_PATH } from "../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

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
      recordId: 10,
      approvalId: "bia",
      body: { data: { approval_status: "requested" } },
      message: "Updated successfully",
      redirect: false
    };

    const expectedAction = {
      type: `cases/${APPROVE_RECORD}`,
      api: {
        path: "cases/10/approvals/bia",
        method: "PATCH",
        body: args.body,
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: args.message,
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: false,
          redirect: false
        }
      }
    };

    expect(actionCreators.approvalRecord(args)).to.deep.equal(expectedAction);
  });
});
