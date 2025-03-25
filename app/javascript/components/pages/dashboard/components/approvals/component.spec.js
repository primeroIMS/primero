// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS, DASH_APPROVALS_PENDING } from "../../../../permissions";
import { PrimeroModuleRecord } from "../../../../application/records";

import Approvals from "./component";

describe("<Approvals> - pages/dashboard/components/reporting-location", () => {
  const permissions = {
    dashboards: [
      ACTIONS.DASH_APPROVALS_ASSESSMENT,
      ACTIONS.DASH_APPROVALS_CASE_PLAN,
      ACTIONS.DASH_APPROVALS_CLOSURE,
      ACTIONS.DASH_APPROVALS_ACTION_PLAN,
      ACTIONS.DASH_APPROVALS_GBV_CLOSURE,
      DASH_APPROVALS_PENDING
    ]
  };

  describe("when component has data", () => {
    const state = fromJS({
      records: {
        dashboard: {
          data: [
            {
              name: "dashboard.approvals_assessment.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_assessment_pending: {
                  count: 1,
                  query: []
                }
              }
            },
            {
              name: "dashboard.approvals_case_plan.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_case_plan_pending: {
                  count: 2,
                  query: []
                }
              }
            },
            {
              name: "dashboard.approvals_closure.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_closure_pending: {
                  count: 3,
                  query: []
                }
              }
            },
            {
              name: "dashboard.approvals_action_plan.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_action_plan_pending: {
                  count: 4,
                  query: []
                }
              }
            },
            {
              name: "dashboard.approvals_gbv_closure.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_gbv_closure_pending: {
                  count: 5,
                  query: []
                }
              }
            },
            {
              name: "dashboard.approvals_assessment_pending.primeromodule-cp",
              type: "indicator",
              indicators: {
                approval_assessment_pending_group: {
                  count: 1,
                  query: []
                }
              }
            }
          ]
        }
      },
      user: {
        permissions,
        modules: ["primeromodule-cp"]
      },
      application: {
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            name: "CP",
            approvals_labels: {
              assessment: {
                en: "Assessment"
              },
              case_plan: {
                en: "Case Plan"
              },
              closure: {
                en: "Closure"
              },
              action_plan: {
                en: "Action Plan"
              },
              gbv_closure: {
                en: "GBV Closure"
              }
            }
          })
        ]
      }
    });

    beforeEach(() => {
      mountedComponent(<Approvals />, state);
    });

    it("should render 6 <OptionsBox /> component", () => {
      expect(screen.getAllByTestId("option-box")).toHaveLength(6);
    });

    it("should render the correct approvals label", () => {
      expect(screen.getByText("1 Assessment")).toBeInTheDocument();
      expect(screen.getByText("2 Case Plan")).toBeInTheDocument();
      expect(screen.getByText("3 Closure")).toBeInTheDocument();
      expect(screen.getByText("4 Action Plan")).toBeInTheDocument();
      expect(screen.getByText("5 GBV Closure")).toBeInTheDocument();
    });
  });

  describe("when the data is loading", () => {
    const props = {
      loadingIndicator: {
        overlay: true,
        type: "NAMESPACE",
        loading: true,
        errors: false
      }
    };

    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<Approvals {...props} />, {
        records: {
          dashboard: {
            data: [],
            loading: true
          }
        },
        user: {
          permissions,
          modules: ["primeromodule-cp"]
        },
        application: {
          modules: [
            PrimeroModuleRecord({
              unique_id: "primeromodule-cp",
              name: "CP"
            })
          ]
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
