import { mountedComponent, screen } from "../../test-utils";

import TransitionPanel from "./TransitionPanel";

describe("<TransitionPanel />", () => {
  const props = {
    children: <p>This is a children</p>
  };

  it("renders a <p> as children of TransitionPanel", () => {
    mountedComponent(<TransitionPanel {...props} />);

    expect(screen.getByText(/This is a children/i)).toBeInTheDocument();
  });

  it("renders an Accordion component", () => {
    mountedComponent(<TransitionPanel {...props} />);

    expect(screen.getByTestId("accordion")).toBeInTheDocument();
  });
});
