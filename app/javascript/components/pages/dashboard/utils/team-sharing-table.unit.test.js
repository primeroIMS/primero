import { fromJS } from "immutable";

import teamSharingTable from "./team-sharing-table";

describe("teamSharingTable - pages/dashboard/utils/", () => {
  const i18nMock = { t: text => text, locale: "en" };
  const data = fromJS({
    name: "dashboard.dash_shared_with_my_team",
    type: "indicator",
    indicators: {
      shared_with_my_team_referrals: {
        primero_cp: {
          count: 1,
          query: ["referred_users=primero_cp"]
        }
      },
      shared_with_my_team_pending_transfers: {
        primero_cp: {
          count: 2,
          query: ["transferred_to_users=primero_cp"]
        },
        primero_cp_ar: {
          count: 1,
          query: ["transferred_to_users=primero_cp_ar"]
        }
      }
    }
  });

  it("should return empty object if data is empty ", () => {
    expect(teamSharingTable(fromJS({}), i18nMock)).to.be.empty;
  });

  it("should respond true when at least one taskOverdue has data", () => {
    const expected = {
      columns: [
        { name: "caseWorker", label: "dashboard.case_worker" },
        {
          name: "shared_with_my_team_referrals",
          label: "dashboard.shared_with_my_team_referrals"
        },
        {
          name: "shared_with_my_team_pending_transfers",
          label: "dashboard.shared_with_my_team_pending_transfers"
        }
      ],
      data: [
        {
          caseWorker: "primero_cp",
          shared_with_my_team_referrals: 1,
          shared_with_my_team_pending_transfers: 2
        },
        {
          caseWorker: "primero_cp_ar",
          shared_with_my_team_pending_transfers: 1,
          shared_with_my_team_referrals: 0
        }
      ],
      query: [
        {
          caseWorker: "primero_cp",
          shared_with_my_team_referrals: ["referred_users=primero_cp"],
          shared_with_my_team_pending_transfers: [
            "transferred_to_users=primero_cp"
          ]
        },
        {
          caseWorker: "primero_cp_ar",
          shared_with_my_team_referrals: 0,
          shared_with_my_team_pending_transfers: [
            "transferred_to_users=primero_cp_ar"
          ]
        }
      ]
    };

    expect(teamSharingTable(data, i18nMock)).to.deep.equals(expected);
  });
});
