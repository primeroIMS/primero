import { mountedComponent, screen } from "../../test-utils";

import Tooltip from "./component";

describe("components/tooltip", () => {
  it("renders tooltip", () => {
    // eslint-disable-next-line react/display-name
    function TooltipComponent() {
      return (
        <Tooltip title="wrapper content" data-testid="wrapper-content">
          <div>wrapped children</div>
        </Tooltip>
      );
    }

    mountedComponent(<TooltipComponent />);
    expect(screen.getByText(/wrapped children/i)).toBeInTheDocument();
  });

  it("does not render tooltip without title", () => {
    // eslint-disable-next-line react/display-name, react/no-multi-comp
    function TooltipComponent() {
      return (
        <Tooltip title="">
          <div>wrapped children</div>
        </Tooltip>
      );
    }

    mountedComponent(<TooltipComponent />);
    expect(screen.getByText(/wrapped children/i)).toBeInTheDocument();
    expect(screen.queryAllByRole("tooltip")).toHaveLength(0);
  });
});
