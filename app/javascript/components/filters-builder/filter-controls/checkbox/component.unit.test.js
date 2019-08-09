import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { FormGroup, FormControlLabel } from "@material-ui/core";
import CheckBox from "./component";

describe("<CheckBox /> - Component", () => {
  const mockedData = {
    id: "my_cases",
    display_name: "My Cases",
    type: "checkbox",
    options: {
      values: [
        { id: "my_cases", display_name: "My Cases" },
        { id: "referred_cases", display_name: "Cases referred to me" }
      ]
    }
  }
  let component;

  before(() => {
    component = setupMountedComponent(
      CheckBox,
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

  it("renders the FormGroup", () => {
    expect(component.find(FormGroup)).to.have.length(1);
  });

  it("renders the FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(2);
  });

});