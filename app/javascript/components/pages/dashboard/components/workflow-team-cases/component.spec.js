// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";
import { PrimeroModuleRecord } from "../../../../application/records";

import WorkflowTeamCases from "./component";

describe("<WorkflowTeamCases> - pages/dashboard/components/workflow-team-cases", () => {
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_WORKFLOW_TEAM]
  };
  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.workflow_team",
            type: "indicator",
            indicators: {
              workflow_team: {
                primero_cp: {
                  new: {
                    count: 5,
                    query: ["record_state=true", "workflow=new"]
                  },
                  case_plan: {
                    count: 2,
                    query: ["record_state=true", "workflow=case_plan"]
                  },
                  response_type1: {
                    count: 0,
                    query: ["record_state=true", "workflow=response_type1"]
                  }
                },
                primero_mgr_cp: {
                  new: {
                    count: 0,
                    query: ["record_state=true", "workflow=new"]
                  },
                  case_plan: {
                    count: 1,
                    query: ["record_state=true", "workflow=case_plan"]
                  },
                  response_type1: {
                    count: 4,
                    query: ["record_state=true", "workflow=response_type1"]
                  }
                },
                "": {
                  new: {
                    count: 0,
                    query: ["record_state=true", "workflow=new"]
                  },
                  case_plan: {
                    count: 0,
                    query: ["record_state=true", "workflow=case_plan"]
                  },
                  response_type1: {
                    count: 0,
                    query: ["record_state=true", "workflow=response_type1"]
                  }
                }
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
          workflows: {
            case: [
              { id: "new", display_text: { en: "New" } },
              { id: "case_plan", display_text: { en: "Case plan" } },
              {
                id: "response_type1",
                display_text: { en: "Response Type 1" }
              }
            ]
          }
        })
      ]
    }
  });

  beforeEach(() => {
    mountedComponent(<WorkflowTeamCases />, state);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  xit("should render 4 columns", () => {
    expect(tableCells).to.have.lengthOf(4);
  });

  it("should render New column", () => {
    expect(screen.getAllByText("New")).toBeTruthy();
  });

  it("should render Case plan column", () => {
    expect(screen.getAllByText("Case plan")).toBeTruthy();
  });

  it("should render Response Type 1 column", () => {
    expect(screen.getAllByText("Response Type 1")).toBeTruthy();
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
      mountedComponent(<WorkflowTeamCases {...props} />, {
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
