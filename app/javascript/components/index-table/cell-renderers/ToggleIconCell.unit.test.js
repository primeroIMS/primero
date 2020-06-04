import { fromJS } from "immutable";
import { Flag } from "@material-ui/icons";

import { setupMountedComponent } from "../../../test";
import Jewel from "../../jewel";
import { ALERTS_COLUMNS } from "../../record-list/constants";

import ToggleIconCell from "./ToggleIconCell";

describe("<ToggleIconCell /> - Component", () => {
  let component;

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
    component = setupMountedComponent(
      ToggleIconCell,
      { value: true, icon: ALERTS_COLUMNS.alert_count },
      initialState
    ).component;
  });

  it("renders ToggleIconCell component", () => {
    expect(component.find(ToggleIconCell)).to.have.lengthOf(1);
  });

  it("renders Jewel when alert_count is present", () => {
    expect(component.find(Jewel)).to.have.lengthOf(1);
  });

  describe("when the record has flag", () => {
    beforeEach(() => {
      component = setupMountedComponent(
        ToggleIconCell,
        { value: 3, icon: ALERTS_COLUMNS.flag_count },
        {}
      ).component;
    });
    it("render the Flag component with number of flags", () => {
      const componeneRendered = component.find(ToggleIconCell);

      expect(componeneRendered.find(Flag)).to.have.lengthOf(1);
      expect(componeneRendered.text()).to.equal("3");
    });
  });
});
