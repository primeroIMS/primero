import { expect } from "chai";

import { setupMountedComponent } from "../../../../test";
import { fromJS, Map } from "immutable";

import WorkflowIndicator from "./WorkflowIndicator";
import { PrimeroModuleRecord } from "../../../application/records";
import { StepLabel } from "@material-ui/core";

describe("<WorkflowIndicator />", () => {
  let state;

  const defaultProps = {
    locale: "en",
    primeroModule: "primeromodule-cp",
    recordType: "cases"
  };

  before(() => {
    state = Map({
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application: fromJS({
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            workflows: {
              case: {
                en: [
                  {
                    id: "new",
                    display_text: "New"
                  },
                  {
                    id: "reopened",
                    display_text: "Reopened"
                  },
                  {
                    id: "services",
                    display_text: "Services"
                  },
                  {
                    id: "closed",
                    display_text: "Closed"
                  }
                ]
              }
            }
          })
        ]
      })
    });
  });

  it("renders the workflow indicator", () => {
    const component = setupMountedComponent(
      WorkflowIndicator,
      {
        ...defaultProps,
        record: Map({ case_status_reopened: false, workflow: "services" })
      },
      state
    ).component;

    const steps = component.find(StepLabel);
    expect(steps.at(1).props().active).to.equal(true);
    expect(steps.at(0).text()).to.include("New");
    expect(steps.at(1).props().active).to.equal(true);
    expect(steps.at(1).text()).to.include("Services");
    expect(steps.at(2).props().active).to.equal(false);
    expect(steps.at(2).text()).to.include("Closed");
  });

  it("renders status reopened if case has been reopened", () => {
    const component = setupMountedComponent(
      WorkflowIndicator,
      {
        ...defaultProps,
        record: Map({ case_status_reopened: true, workflow: "service" })
      },
      state
    ).component;

    const steps = component.find(StepLabel);
    expect(steps.at(0).text()).to.include("Reopened");
  });
});
