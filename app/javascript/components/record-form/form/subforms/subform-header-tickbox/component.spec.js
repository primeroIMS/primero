import { mountedComponent, screen } from "../../../../../test-utils";

import TickBoxHeader from "./component";

describe("<SubformTickBoxHeader /> - Form - Subforms", () => {
  const label = "This is a tickbox label";

  it("should render the label if value is true", () => {
    const props = {
      value: true,
      tickBoxLabel: { en: label }
    };

    // const { component } = setupMountedComponent(TickBoxHeader, props);
    mountedComponent(<TickBoxHeader {...props} />);

    expect(screen.getByText(/This is a tickbox label/i)).toBeInTheDocument();
  });

  it("should render empty the label if value is true", () => {
    const props = {
      value: false,
      tickBoxLabel: { en: label }
    };

    mountedComponent(<TickBoxHeader {...props} />);
    expect(screen.queryByText(/This is a tickbox label/i)).toBeNull();
  });

  it("should render yes label if value is true and the tickBoxLabel is empty", () => {
    const props = {
      value: true,
      tickBoxLabel: {}
    };

    mountedComponent(<TickBoxHeader {...props} />);
    expect(screen.getByText("yes_label")).toBeInTheDocument();
  });
});
