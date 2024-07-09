import { mountedComponent, screen } from "../../test-utils";

import ListIcon from "./component";

describe("<ListIcon />", () => {
  it("renders correct icon", () => {
    mountedComponent(<ListIcon icon="cases" />);
    expect(screen.getByTestId("cases-icon")).toBeInTheDocument();
  });

  it("renders incidents icon", () => {
    mountedComponent(<ListIcon icon="incidents" />);
    expect(screen.getByTestId("incidents-icon")).toBeInTheDocument();
  });
});
