import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import IndexFilters from "./component";
import MoreSection from "./components/more-section";
import FilterActions from "./components/actions";
import { Search } from "./components/filter-types";

describe("<IndexFitlers>", () => {
  const state = fromJS({
    user: {
      filters: {
        cases: [
          {
            field_name: "filter1",
            name: "filter1",
            options: [{ id: "true", display_name: "Filter 1" }],
            type: "checkbox"
          }
        ]
      }
    }
  });

  const props = {
    recordType: "cases"
  };

  it("renders search bar", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.exists("input#search-input")).to.be.true;
  });

  it("renders search bar with valid props", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);
    const clone = { ...component.find(Search).props() };

    ["handleReset"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("renders MoreSection filters", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.find(MoreSection)).to.have.lengthOf(1);
  });

  it("renders FilterActions filters", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.find(FilterActions)).to.have.lengthOf(1);
  });
});
