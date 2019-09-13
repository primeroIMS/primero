import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Switch } from "@material-ui/core";
import SwitchButton from "./component";

describe("<SwitchButton /> - Component", () => {
  const mockedData = {
    name: "My Cases",
    field_name: "my_cases",
    type: "switch",
    options: [
      { id: "my_cases", display_name: "My Cases" },
      { id: "referred_cases", display_name: "Cases referred to me" }
    ]
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      SwitchButton,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              my_cases: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the Switch", () => {
    expect(component.find(Switch)).to.have.length(2);
  });
});
