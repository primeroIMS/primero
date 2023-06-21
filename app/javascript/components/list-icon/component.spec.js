import { mountedComponent, screen } from "../../test-utils";

import ListIcon from "./component";

describe("<ListIcon />", () => {
  it("renders correct icon", () => {
    mountedComponent(<ListIcon icon="cases" />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
  });
  it("renders incidents icon", () => {
    mountedComponent(<ListIcon icon="incidents" />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
  });
});
