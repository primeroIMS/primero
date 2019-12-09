import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import { Jewel } from "../../jewel";

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
      { value: true, icon: "alert_count" },
      initialState
    ).component;
  });

  it("renders ToggleIconCell component", () => {
    expect(component.find(ToggleIconCell)).to.have.lengthOf(1);
  });

  it("renders Jewel when alert_count is present", () => {
    expect(component.find(Jewel)).to.have.lengthOf(1);
  });
});
