import { expect } from "chai";
import { Map } from "immutable";
import { FormGroup, FormControlLabel } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import CheckBox from "./component";

describe("<CheckBox /> - Component", () => {
  const mockedData = {
    name: "cases.filter_by.flag",
    field_name: "flagged",
    type: "checkbox",
    options: {
      en: [
        {
          id: "true",
          display_name: "Flagged?"
        }
      ],
      es: [
        {
          id: "true",
          display_name: "Marcado?"
        }
      ]
    }
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      CheckBox,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              flagged: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the FormGroup", () => {
    expect(component.find(FormGroup)).to.have.lengthOf(1);
  });

  it("renders the FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.lengthOf(1);
  });
});