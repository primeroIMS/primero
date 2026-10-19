import { mountedComponent, screen } from "../../../test-utils";

import PendingTransitionAlert from "./component";

describe("<PendingTransitionAlert />", () => {
  it("renders the pending transition message when there are pending records", () => {
    mountedComponent(<PendingTransitionAlert pendingTransitionIds={["1"]} />);

    expect(screen.getByText("case.messages.pending_transition_excluded")).toBeInTheDocument();
  });

  it("renders nothing when there are no pending records", () => {
    mountedComponent(<PendingTransitionAlert pendingTransitionIds={[]} />);

    expect(screen.queryByText("case.messages.pending_transition_excluded")).not.toBeInTheDocument();
  });
});
