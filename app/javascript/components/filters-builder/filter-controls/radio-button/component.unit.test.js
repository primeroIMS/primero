import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import RadioButton from "./component";

describe("<RadioButton /> - Component", () => {
  const mockedData = {
    id: "sex",
    display_name: "Sex",
    type: "radio",
    reset: true,
    options: {
      values: [
        { id: "female", display_name: "Female" },
        { id: "male", display_name: "Male" },
        { id: "other", display_name: "Other" }
      ]
    }
  }
  let component;

  before(() => {
    component = setupMountedComponent(
      RadioButton,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              sex_: ""
            }
          }
        })
      })
    ).component;
  });

  it("renders the RadioGroup", () => {
    expect(component.find(RadioGroup)).to.have.length(1);
  });

  it("renders the FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(3);
  });

  it("renders the Radio", () => {
    expect(component.find(Radio)).to.have.length(3);
  });

});