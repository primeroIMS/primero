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
});
