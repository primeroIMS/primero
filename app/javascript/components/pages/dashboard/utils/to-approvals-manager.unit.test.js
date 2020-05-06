import { fromJS } from "immutable";

import toApprovalsManager from "./to-approvals-manager";

describe("toApprovalsManager - pages/dashboard/utils/", () => {
  it("should convert the data for OverviewBox", () => {
    const data = fromJS([
      {
        name: "dashboard.approvals_assessment_pending",
        type: "indicator",
        indicators: {
          approval_assessment_pending_group: {
            count: 3,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_bia=pending"
            ]
          }
        }
      },
      {
        name: "dashboard.approvals_case_plan_pending",
        type: "indicator",
        indicators: {
          approval_case_plan_pending_group: {
            count: 2,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_case_plan=pending"
            ]
          }
        }
      }
    ]);
    const expected = fromJS({
      indicators: {
        approval_assessment_pending_group: {
          count: 3,
          query: [
            "record_state=true",
            "status=open",
            "approval_status_bia=pending"
          ]
        },
        approval_case_plan_pending_group: {
          count: 2,
          query: [
            "record_state=true",
            "status=open",
            "approval_status_case_plan=pending"
          ]
        }
      }
    });
    const converted = toApprovalsManager(data);

    expect(converted).to.deep.equal(expected);
  });

  it("should convert the data if one of the indicators is not present OverviewBox", () => {
    const data = fromJS([
      {
        name: "dashboard.approvals_assessment_pending",
        type: "indicator",
        indicators: {
          approval_assessment_pending_group: {
            count: 3,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_bia=pending"
            ]
          }
        }
      },
      {
        name: "dashboard.approvals_case_plan_pending",
        type: "indicator",
        indicators: {}
      }
    ]);
    const expected = fromJS({
      indicators: {
        approval_assessment_pending_group: {
          count: 3,
          query: [
            "record_state=true",
            "status=open",
            "approval_status_bia=pending"
          ]
        }
      }
    });
    const converted = toApprovalsManager(data);

    expect(converted).to.deep.equal(expected);
  });

  it("should return an empty indicator key", () => {
    const data = fromJS([
      {
        name: "dashboard.approvals_assessment_pending",
        type: "indicator",
        indicators: {}
      },
      {
        name: "dashboard.approvals_case_plan_pending",
        type: "indicator",
        indicators: {}
      }
    ]);
    const expected = fromJS({
      indicators: {}
    });
    const converted = toApprovalsManager(data);

    expect(converted).to.deep.equal(expected);
  });
});
