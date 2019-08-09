import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { FormControl, Select, OutlinedInput } from "@material-ui/core";
import SelectFilter from "./component";

describe("<SelectFilter /> - Component", () => {
  const mockedData = {
    id: "status",
    display_name: "Case Status",
    type: "select",
    options: {
      values: [
        { id: "open", display_name: "Open" },
        { id: "closed", display_name: "Closed" },
        { id: "transferred", display_name: "Transferred" },
        { id: "duplicate", display_name: "Duplicate" }
      ]
    }
  }
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
    expect(component.find(FormControl)).to.have.length(1);
  });

  it("renders the Select", () => {
    expect(component.find(Select)).to.have.length(1);
  });

  it("renders the OutlinedInput", () => {
    expect(component.find(OutlinedInput)).to.have.length(1);
  });

});