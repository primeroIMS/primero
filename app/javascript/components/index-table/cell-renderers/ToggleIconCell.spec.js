import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ALERTS_COLUMNS } from "../../record-list/constants";

import ToggleIconCell from "./ToggleIconCell";

describe("<ToggleIconCell /> - Component", () => {
  const initialState = fromJS({
    ui: {
      Nav: {
        drawerOpen: true,
        alerts: {
          data: {
            case: 2,
            incident: 0,
            tracing_request: 1
          }
        }
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ToggleIconCell value icon={ALERTS_COLUMNS.alert_count} />, initialState);
  });

  it("renders ToggleIconCell component", () => {
    expect(screen.getByTestId("toggle-icon-cell")).toBeInTheDocument();
  });

  it("renders Jewel when alert_count is present", () => {
    const flagIconComponent = screen.queryByTestId("jewel");

    expect(flagIconComponent).toBeInTheDocument();
  });

  describe("when the record has flag", () => {
    beforeEach(() => {
      mountedComponent(<ToggleIconCell value icon={ALERTS_COLUMNS.alert_count} />, initialState);
    });

    it("render the Flag component with number of flags", () => {
      mountedComponent(<ToggleIconCell value={3} icon={ALERTS_COLUMNS.flag_count} />);
      const flagIconComponent = screen.queryByTestId("flag-icon");

      expect(flagIconComponent).toBeInTheDocument();
      expect(flagIconComponent).toHaveTextContent("3");
    });
  });
});
