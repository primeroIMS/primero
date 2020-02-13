import { expect, stub } from "../../../../test/unit-test-helpers";
import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<ReferralAction /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("referralDone");
    delete creators.referralDone;

    expect(creators).to.deep.equal({});
  });

  it("should check that 'referralDone' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      message: "Updated successfully",
      recordId: "10",
      recordType: "cases",
      transistionId: "20"
    };

    const expectedAction = {
      type: actions.REFERRAL_DONE,
      api: {
        path: `cases/10/referrals/20`,
        method: "DELETE",
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: args.message,
            options: {
              variant: "success",
              key: 4
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/${RECORD_PATH.cases}`
        }
      }
    };

    expect(actionCreators.referralDone(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
