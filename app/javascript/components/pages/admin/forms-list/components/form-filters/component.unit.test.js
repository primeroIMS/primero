import { List } from "immutable";
import { Button } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";
import FiltersExpansionPanel from "../filters-expansion-panel";

import FormFilters from "./component";

describe("<FormsList />/components/<FormFilters />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormFilters, {
      modules: List([
        {
          name: "Module 1",
          unique_id: "module-1",
          associated_record_types: ["record-type-1"]
        },
        {
          name: "Module 2",
          unique_id: "module-2",
          associated_record_types: ["record-type-2"]
        }
      ]),
      handleClearValue: () => {},
      handleSetFilterValue: () => {}
    }));
  });

  it("renders clear button", () => {
    const clearButton = component.find(Button);

    expect(clearButton).to.have.lengthOf(1);
    expect(clearButton.text()).to.equal("clear");
  });

  it.skip("clear button responds to onClick from pass function", () => {});

  it("renders <FiltersExpansionPanel />", () => {
    expect(component.find(FiltersExpansionPanel)).to.have.lengthOf(2);
  });
});
