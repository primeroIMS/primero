// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";
import { PrimeroModuleRecord } from "../../../../application/records";
import { MODULES } from "../../../../../config";

import WorkflowIndividualCases from "./component";

describe("<WorkflowIndividualCases> - pages/dashboard/components/workflow-individual-cases", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_WORKFLOW]
  };

  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
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
          }
        ]
      }
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: MODULES.CP,
          name: "CP",
          workflows: {
            case: [
              { id: "new", display_text: { en: "New" } },
              { id: "care_plan", display_text: { en: "Care plan" } },
              {
                id: "service_provision",
                display_text: { en: "Service provision" }
              }
            ]
          }
        })
      ]
    },
    user: {
      modules: [MODULES.CP],
      permissions
    }
  });

  beforeEach(() => {
    mountedComponent(<WorkflowIndividualCases />, state);
  });

  it("should render an <OptionsBox /> component", () => {
    expect(screen.getByTestId("option-box")).toBeInTheDocument();
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

    it.skip("renders a <LoadingIndicator />", () => {
      mountedComponent(<WorkflowIndividualCases {...props} />, {
        records: {
          dashboard: {
            data: [],
            loading: true
          }
        },
        user: {
          permissions
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
