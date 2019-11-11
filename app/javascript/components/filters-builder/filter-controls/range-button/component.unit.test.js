
import { expect } from "chai";
import { setupMountedComponent } from "../../../../test";
import { Map } from "immutable";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import RangeButton from "./component";

describe("<RangeButton /> - Component", () => {
  const mockedData = {
    name: "Age",
    field_name: "age_range",
    type: "multi_toggle",
    options: [
      { id: "age_0_5", display_name: "0 - 5" },
      { id: "age_6_11", display_name: "6 - 11" },
      { id: "age_12_17", display_name: "12 - 17" },
      { id: "age_18_more", display_name: "18+" }
    ]
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      RangeButton,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              age_range: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the ToggleButtonGroup", () => {
    expect(component.find(ToggleButtonGroup)).to.have.length(1);
  });

  it("renders the ToggleButton", () => {
    expect(component.find(ToggleButton)).to.have.length(4);
  });
});
