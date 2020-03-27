import { fromJS } from "immutable";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { PieChart, OptionsBox } from "../../../../dashboard";
import { LoadingIndicator } from "../../../../loading-indicator";
import { PrimeroModuleRecord } from "../../../../application/records";

import WorkflowIndividualCases from "./component";

describe("<WorkflowIndividualCases> - pages/dashboard/components/workflow-individual-cases", () => {
  let component;
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
                  { id: "care_plan", display_text: "Care plan" },
                  {
                    id: "service_provision",
                    display_text: "Service provision"
                  }
                ]
              }
            }
          })
        ]
      }
    },
    user: {
      permissions
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(WorkflowIndividualCases, {}, state));
  });

  it("should render an <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(1);
  });

  it("should render a <PieChart /> component", () => {
    expect(component.find(PieChart)).to.have.lengthOf(1);
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
        WorkflowIndividualCases,
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
