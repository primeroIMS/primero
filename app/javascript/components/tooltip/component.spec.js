import { mountedComponent, screen } from "../../test-utils";

import Tooltip from "./component";

describe("components/tooltip", () => {
  it("renders tooltip", () => {
    const TooltipComponent = () => (
      <Tooltip title="wrapper content" data-testid="wrapper-content">
        <div>wrapped children</div>
      </Tooltip>
    );

    mountedComponent(<TooltipComponent />);
    expect(screen.getByText(/wrapped children/i)).toBeInTheDocument();
  });

  it("does not render tooltip without title", () => {
    const TooltipComponent = () => (
      <Tooltip title="">
        <div>wrapped children</div>
      </Tooltip>
    );

    mountedComponent(<TooltipComponent />);
    expect(screen.getByText(/wrapped children/i)).toBeInTheDocument();
    expect(screen.queryAllByRole("tooltip")).toHaveLength(0);
  });
});
