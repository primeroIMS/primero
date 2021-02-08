import { setupMountedComponent } from "../../../../test";

import SingleAggregateMetric from "./component";

describe("<SingleAggregateMetric />", () => {
  it("Should display the given label", () => {
    const { component } = setupMountedComponent(SingleAggregateMetric, {
      label: "Test"
    });

    expect(component.render().text()).to.equal("Test");
  });

  it("should display the given value", () => {
    const { component } = setupMountedComponent(SingleAggregateMetric, {
      label: "Test",
      value: 50
    });

    expect(component.render().text()).to.contain("50");
  });
});
