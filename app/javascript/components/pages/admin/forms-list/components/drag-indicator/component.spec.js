import { mountedComponent, screen } from "test-utils";

import DragIndicator from "./component";

describe("<FormsList />/components/<DragIndicator />", () => {
  beforeEach(() => {
    const props = { color: "error" };

    mountedComponent(<DragIndicator />, props);
  });

  it("renders icon", () => {
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });
});
