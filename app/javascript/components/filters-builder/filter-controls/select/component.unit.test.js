import { expect } from "chai";
import { Map } from "immutable";
import { FormControl, Select } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import SelectFilter from "./component";

describe("<SelectFilter /> - Component", () => {
  const mockedData = {
    name: "Case Status",
    field_name: "status",
    type: "select",
    options: {
      en: [
        { id: "open", display_name: "Open" },
        { id: "closed", display_name: "Closed" },
        { id: "transferred", display_name: "Transferred" },
        { id: "duplicate", display_name: "Duplicate" }
      ]
    }
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      SelectFilter,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              status: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the FormControl", () => {
    expect(component.find(FormControl)).to.have.lengthOf(1);
  });

  it("renders the Select", () => {
    expect(component.find(Select)).to.have.lengthOf(1);
  });
});
