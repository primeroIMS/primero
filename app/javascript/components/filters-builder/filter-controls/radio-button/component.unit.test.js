import { expect } from "chai";
import { Map } from "immutable";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import RadioButton from "./component";

describe("<RadioButton /> - Component", () => {
  const mockedData = {
    name: "Sex",
    field_name: "sex",
    type: "radio",
    options: {
      en: [
        { id: "female", display_name: "Female" },
        { id: "male", display_name: "Male" },
        { id: "other", display_name: "Other" }
      ],
      es: [
        { id: "female", display_name: "Femenino" },
        { id: "male", display_name: "Masculino" },
        { id: "other", display_name: "Otro" }
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
    expect(component.find(RadioGroup)).to.have.lengthOf(1);
  });

  it("renders the FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.lengthOf(3);
  });

  it("renders the Radio", () => {
    expect(component.find(Radio)).to.have.lengthOf(3);
  });

});
