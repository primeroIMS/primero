import { fromJS } from "immutable";
import { Stepper, Step, StepLabel } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import LoadingIndicator from "../../../../loading-indicator";
import { PrimeroModuleRecord } from "../../../../application/records";
import { MODULES } from "../../../../../config";

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
    ({ component } = setupMountedComponent(WorkflowIndividualCases, {}, state));
  });

  it("should render an <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(1);
  });

  it("should render a <Stepper /> component", () => {
    expect(component.find(Stepper)).to.have.lengthOf(1);
  });

  it("should render a <Step /> component", () => {
    expect(component.find(Step)).to.have.lengthOf(3);
  });

  it("should render a <StepLabel /> component", () => {
    expect(component.find(StepLabel)).to.have.lengthOf(3);
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
      const { component: loadingComponent } = setupMountedComponent(WorkflowIndividualCases, props, {
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

      expect(loadingComponent.find(LoadingIndicator)).to.have.lengthOf(1);
    });
  });
});
