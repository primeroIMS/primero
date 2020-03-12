import { fromJS } from "immutable";

import { expect } from "../../../test";
import { ACTIONS, RESOURCES } from "../../../libs/permissions";

import * as helper from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      [
        "toData1D",
        "toListTable",
        "toReportingLocationTable",
        "toApprovalsManager",
        "toProtectionConcernTable",
        "toTasksOverdueTable",
        "permittedSharedWithMe",
        "taskOverdueHasData",
        "teamSharingTable"
      ].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("toData1D", () => {
    const casesWorkflow = fromJS({
      name: "dashboard.workflow",
      type: "indicator",
      indicators: {
        workflow: {
          new: {
            count: 10,
            query: ["workflow=new"]
          },
          service_provision: {
            count: 15,
            query: ["workflow=service_provision"]
          },
          care_plan: {
            count: 8,
            query: ["workflow=care_plan"]
          }
        }
      }
    });

    it("should convert data to plain JS", () => {
      const expected = {
        labels: ["New", "Service provision", "Care plan"],
        data: [10, 15, 8],
        query: [
          ["workflow=new"],
          ["workflow=service_provision"],
          ["workflow=care_plan"]
        ]
      };

      const workflowLabels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" },
        { id: "care_plan", display_text: "Care plan" },
        { id: "action_plan", display_text: "Action plan" },
        { id: "service_provision", display_text: "Service provision" },
        { id: "services_implemented", display_text: "Service Implemented" },
        { id: "closed", display_text: "Closed" }
      ];

      expect(helper.toData1D(casesWorkflow, workflowLabels)).to.deep.equal(
        expected
      );
    });

    it("should not return labels if there are not translations", () => {
      const { labels } = helper.toData1D(casesWorkflow, []);

      expect(labels).to.be.empty;
    });
  });

  describe("toListTable", () => {
    it("should convert data to plain JS", () => {
      const data = fromJS({
        name: "dashboard.workflow_team",
        type: "indicator",
        indicators: {
          workflow_team: {
            "": {
              "": {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              },
              case_plan: {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              },
              new: {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              }
            },
            primero: {
              "": {
                count: 0,
                query: ["status=open", "owned_by=primero", "workflow="]
              },
              case_plan: {
                count: 1,
                query: ["status=open", "owned_by=primero", "workflow=case_plan"]
              },
              new: {
                count: 3,
                query: ["status=open", "owned_by=primero", "workflow=count"]
              }
            }
          }
        }
      });

      const labels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" }
      ];

      const expected = {
        columns: [
          { name: "", label: "" },
          { name: "new", label: "New" },
          { name: "case_plan", label: "Case Plan" }
        ],
        data: [{ "": "primero", case_plan: 1, new: 3 }],
        query: [
          {
            "": "primero",
            case_plan: [
              "status=open",
              "owned_by=primero",
              "workflow=case_plan"
            ],
            new: ["status=open", "owned_by=primero", "workflow=count"]
          }
        ]
      };

      expect(helper.toListTable(data, labels)).to.deep.equal(expected);
    });
  });

  describe("toReportingLocationTable", () => {
    it("should convert the data for the table", () => {
      const locations = fromJS([
        {
          id: 1,
          code: "1506060",
          type: "sub_district",
          name: { en: "My District" }
        }
      ]);

      const data = fromJS({
        name: "dashboard.reporting_location",
        type: "indicator",
        indicators: {
          reporting_location_open: {
            "1506060": {
              count: 1,
              query: [
                "record_state=true",
                "status=open",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_open_last_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=open",
                "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_open_this_week: {
            "1506060": {
              count: 1,
              query: [
                "record_state=true",
                "status=open",
                "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_closed_last_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=closed",
                "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_closed_this_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=closed",
                "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                "owned_by_location2=1506060"
              ]
            }
          }
        }
      });

      const expected = [["My District", 1, 0, 1, 0, 0]];

      const i18nMock = { t: () => ({}), locale: "en" };

      const converted = helper.toReportingLocationTable(
        data,
        "district",
        i18nMock,
        locations
      ).data;

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("toApprovalsManager", () => {
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
      const converted = helper.toApprovalsManager(data);

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
      const converted = helper.toApprovalsManager(data);

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
      const converted = helper.toApprovalsManager(data);

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("toProtectionConcernTable", () => {
    it("should convert the data for DashboardTable", () => {
      const i18nMock = { t: () => ({}), locale: "en" };
      const lookups = [
        {
          id: "sexually_exploited",
          display_text: { en: "Sexually Exploited", fr: "" }
        }
      ];

      const data = fromJS({
        name: "dashboard.dash_protection_concerns",
        type: "indicator",
        indicators: {
          protection_concerns_open_cases: {
            sexually_exploited: {
              count: 1,
              query: [
                "record_state=true",
                "status=open",
                "protection_concerns=sexually_exploited"
              ]
            }
          },
          protection_concerns_new_this_week: {
            sexually_exploited: {
              count: 2,
              query: [
                "record_state=true",
                "status=open",
                "created_at=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
                "protection_concerns=sexually_exploited"
              ]
            }
          },
          protection_concerns_all_cases: {
            sexually_exploited: {
              count: 4,
              query: [
                "record_state=true",
                "protection_concerns=sexually_exploited"
              ]
            }
          },
          protection_concerns_closed_this_week: {
            sexually_exploited: {
              count: 1,
              query: [
                "record_state=true",
                "status=closed",
                "date_closure=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
                "protection_concerns=sexually_exploited"
              ]
            }
          }
        }
      });

      const expected = {
        columns: [
          { name: "", label: {} },
          { name: "protection_concerns_all_cases", label: {} },
          { name: "protection_concerns_open_cases", label: {} },
          { name: "protection_concerns_new_this_week", label: {} },
          { name: "protection_concerns_closed_this_week", label: {} }
        ],
        data: [
          {
            "": "Sexually Exploited",
            protection_concerns_all_cases: 4,
            protection_concerns_open_cases: 1,
            protection_concerns_new_this_week: 2,
            protection_concerns_closed_this_week: 1
          }
        ],
        query: [
          {
            "": "Sexually Exploited",
            protection_concerns_all_cases: [
              "record_state=true",
              "protection_concerns=sexually_exploited"
            ],
            protection_concerns_open_cases: [
              "record_state=true",
              "status=open",
              "protection_concerns=sexually_exploited"
            ],
            protection_concerns_new_this_week: [
              "record_state=true",
              "status=open",
              "created_at=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
              "protection_concerns=sexually_exploited"
            ],
            protection_concerns_closed_this_week: [
              "record_state=true",
              "status=closed",
              "date_closure=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
              "protection_concerns=sexually_exploited"
            ]
          }
        ]
      };

      const converted = helper.toProtectionConcernTable(
        data,
        i18nMock,
        lookups
      );

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("toTasksOverdueTable", () => {
    it("should convert the data for DashboardTable", () => {
      const i18nMock = { t: () => ({}), locale: "en" };

      const data = [
        fromJS({
          name: "dashboard.cases_by_task_overdue_followups",
          type: "indicator",
          indicators: {
            tasks_overdue_followups: {
              primero: {
                count: 0,
                query: ["record_state=true"]
              }
            }
          }
        }),
        fromJS({
          name: "dashboard.cases_by_task_overdue_case_plan",
          type: "indicator",
          indicators: {
            tasks_overdue_case_plan: {
              primero: {
                count: 0,
                query: ["record_state=true"]
              }
            }
          }
        })
      ];

      const expected = {
        columns: [
          { name: "case_worker", label: {} },
          { name: "followups", label: {} },
          { name: "case_plan", label: {} }
        ],
        data: [["primero", 0, 0]],
        query: [
          {
            case_worker: [],
            followups: ["record_state=true"],
            case_plan: ["record_state=true"]
          }
        ]
      };

      const converted = helper.toTasksOverdueTable(data, i18nMock);

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("permittedSharedWithMe", () => {
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

      const permitted = helper.permittedSharedWithMe(
        sharedWithMe,
        userPermissions
      );

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

      const permitted = helper.permittedSharedWithMe(
        sharedWithMe,
        userPermissions
      );

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

      const permitted = helper.permittedSharedWithMe(
        sharedWithMe,
        userPermissions
      );

      expect(permitted).to.deep.equal(expected);
    });
  });

  describe("taskOverdueHasData", () => {
    it("should respond false when taskOverdue has not data", () => {
      const result = helper.taskOverdueHasData(
        fromJS({}),
        fromJS({}),
        fromJS({}),
        fromJS({})
      );

      expect(result).to.be.false;
    });

    it("should respond true when at least one taskOverdue has data", () => {
      const result = helper.taskOverdueHasData(
        fromJS({
          name: "dashboard.cases_by_task_overdue_assessment",
          type: "indicator"
        }),
        fromJS({}),
        fromJS({}),
        fromJS({})
      );

      expect(result).to.be.true;
    });
  });

  describe("teamSharingTable", () => {
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
      expect(helper.teamSharingTable(fromJS({}), i18nMock)).to.be.empty;
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

      expect(helper.teamSharingTable(data, i18nMock)).to.deep.equals(expected);
    });
  });
});
