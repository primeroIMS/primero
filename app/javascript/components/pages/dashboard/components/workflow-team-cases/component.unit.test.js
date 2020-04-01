import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { DashboardTable } from "../../../../dashboard/dashboard-table";
import { LoadingIndicator } from "../../../../loading-indicator";
import { PrimeroModuleRecord } from "../../../../application/records";

import WorkflowTeamCases from "./component";

describe("<WorkflowTeamCases> - pages/dashboard/components/workflow-team-cases", () => {
  let component;
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
            case: {
              en: [
                { id: "new", display_text: "New" },
                { id: "case_plan", display_text: "Case plan" },
                {
                  id: "response_type1",
                  display_text: "Response Type 1"
                }
              ]
            }
          }
        })
      ]
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(WorkflowTeamCases, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 3 columns", () => {
    expect(tableCells).to.have.lengthOf(3);
  });

  it("should render New column", () => {
    expect(tableCells.at(0).text()).to.equal("New");
  });

  it("should render Case plan column", () => {
    expect(tableCells.at(1).text()).to.equal("Case plan");
  });

  it("should render Response Type 1 column", () => {
    expect(tableCells.at(2).text()).to.equal("Response Type 1");
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
      const { component: loadingComponent } = setupMountedComponent(
        WorkflowTeamCases,
        props,
        {
          records: {
            dashboard: {
              data: [],
              loading: true
            }
          },
          user: {
            permissions
          }
        }
      );

      expect(loadingComponent.find(LoadingIndicator)).to.have.lengthOf(1);
    });
  });
});
