import { mountedComponent, screen } from "../../test-utils";

import NetworkIndicator from "./component";

describe("<NetworkIndicator />", () => {
  it("should render an online indicator when the application is online", () => {
    mountedComponent(<NetworkIndicator />, { connectivity: { online: true, serverOnline: true, fieldMode: false } });
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    expect(screen.getByText(/online/i)).toBeInTheDocument();
  });

  it("should render an offline indicator when the application is offline", () => {
    mountedComponent(<NetworkIndicator />, { connectivity: { online: false, serverOnline: true } });
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
