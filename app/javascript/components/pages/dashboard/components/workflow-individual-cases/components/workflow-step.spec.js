// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import WorkFlowStep from "./workflow-step";

describe("<WorkFlowStep> - pages/dashboard/components/workflow-individual-cases/components/workflow-step.jsx", () => {
  const casesWorkflow = fromJS({
    name: "dashboard.workflow",
    type: "indicator",
    indicators: {
      "workflow_test-module": {
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
    i18n: { t: value => value },
    moduleID: "test-module"
  };

  beforeEach(() => {
    mountedComponent(<WorkFlowStep {...props} />);
  });

  it("should render a button component", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a span component", () => {
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
