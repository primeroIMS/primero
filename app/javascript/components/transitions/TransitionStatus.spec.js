import { mountedComponent, screen } from "../../test-utils";

import TransitionStatus from "./TransitionStatus";

describe("<TransitionStatus />", () => {
  const props = {
    status: "inprogress"
  };

  it("renders a Chip TransitionStatus", () => {
    mountedComponent(<TransitionStatus {...props} />);
    expect(screen.getByText(/transition.status.inprogress/i)).toBeInTheDocument();
  });
});
