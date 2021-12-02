import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../test";

import WorkFlowStep from "./workflow-step";

describe("<WorkFlowStep> - pages/dashboard/components/workflow-individual-cases/components/workflow-step.jsx", () => {
  let component;

  const casesWorkflow = fromJS({
    name: "dashboard.workflow",
    type: "indicator",
    indicators: {
      workflow: {
        new: {
          count: 10,
          query: ["workflow=new"]
        }
      }
    }
  });

  const props = {
    step: {
      id: "new"
    },
    casesWorkflow,
    css: {},
    i18n: { t: value => value }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(WorkFlowStep, props));
  });

  it("should render a button component", () => {
    expect(component.find("button")).to.have.lengthOf(1);
  });

  it("should render a span component", () => {
    const span = component.find("span");

    expect(span.text()).to.be.equals("10");
    expect(span).to.have.lengthOf(1);
  });
});
