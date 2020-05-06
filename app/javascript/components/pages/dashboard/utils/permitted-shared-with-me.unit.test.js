import { fromJS } from "immutable";

import { ACTIONS, RESOURCES } from "../../../../libs/permissions";

import permittedSharedWithMe from "./permitted-shared-with-me";

describe("permittedSharedWithMe - pages/dashboard/utils/", () => {
  const sharedWithMe = fromJS({
    name: "dashboard.dash_shared_with_me",
    type: "indicator",
    indicators: {
      shared_with_me_total_referrals: {
        count: 0,
        query: ["record_state=true", "status=open"]
      },
      shared_with_me_new_referrals: {
        count: 0,
        query: ["record_state=true", "status=open", "not_edited_by_owner=true"]
      },
      shared_with_me_transfers_awaiting_acceptance: {
        count: 0,
        query: ["record_state=true", "status=open"]
      }
    }
  });

  it("should return transfer indicators only", () => {
    const userPermissions = fromJS({
      [RESOURCES.cases]: [ACTIONS.RECEIVE_TRANSFER]
    });

    const expected = fromJS({
      indicators: {
        shared_with_me_transfers_awaiting_acceptance: {
          count: 0,
          query: ["record_state=true", "status=open"]
        }
      }
    });

    const permitted = permittedSharedWithMe(sharedWithMe, userPermissions);

    expect(permitted).to.deep.equal(expected);
  });

  it("should return referral indicators only", () => {
    const userPermissions = fromJS({
      [RESOURCES.cases]: [ACTIONS.RECEIVE_REFERRAL]
    });

    const expected = fromJS({
      indicators: {
        shared_with_me_total_referrals: {
          count: 0,
          query: ["record_state=true", "status=open"]
        },
        shared_with_me_new_referrals: {
          count: 0,
          query: [
            "record_state=true",
            "status=open",
            "not_edited_by_owner=true"
          ]
        }
      }
    });

    const permitted = permittedSharedWithMe(sharedWithMe, userPermissions);

    expect(permitted).to.deep.equal(expected);
  });

  it("should return all the indicators", () => {
    const userPermissions = fromJS({
      [RESOURCES.cases]: [ACTIONS.RECEIVE_REFERRAL, ACTIONS.RECEIVE_TRANSFER]
    });

    const expected = fromJS({
      indicators: {
        shared_with_me_total_referrals: {
          count: 0,
          query: ["record_state=true", "status=open"]
        },
        shared_with_me_new_referrals: {
          count: 0,
          query: [
            "record_state=true",
            "status=open",
            "not_edited_by_owner=true"
          ]
        },
        shared_with_me_transfers_awaiting_acceptance: {
          count: 0,
          query: ["record_state=true", "status=open"]
        }
      }
    });

    const permitted = permittedSharedWithMe(sharedWithMe, userPermissions);

    expect(permitted).to.deep.equal(expected);
  });
});
