import { setupMountedComponent } from "../../../../../test";

import TickBoxHeader from "./component";

describe("<SubformTickBoxHeader /> - Form - Subforms", () => {
  const label = "This is a tickbox label";

  it("should render the label if value is true", () => {
    const props = {
      value: true,
      tickBoxLabel: { en: label }
    };
    const { component } = setupMountedComponent(TickBoxHeader, props);

    expect(component.text()).to.be.equal(label);
  });

  it("should render empty the label if value is true", () => {
    const props = {
      value: false,
      tickBoxLabel: { en: label }
    };
    const { component } = setupMountedComponent(TickBoxHeader, props);

    expect(component.text()).to.be.equal("");
  });

  it("should render yes label if value is true and the tickBoxLabel is empty", () => {
    const props = {
      value: true,
      tickBoxLabel: {}
    };
    const { component } = setupMountedComponent(TickBoxHeader, props);

    expect(component.text()).to.be.equal("yes_label");
  });
});
