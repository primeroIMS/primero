import { fromJS, List } from "immutable";

import { expect, setupMockFormComponent } from "../../../test";

import CheckboxFilter from "./filter-types/checkbox-filter/component";
import MoreSection from "./more-section";

describe("<MoreSection>", () => {
  const checkboxFilter = [
    {
      field_name: "filter1",
      name: "filter1",
      options: [{ id: "true", display_name: "Filter 1" }],
      type: "checkbox"
    }
  ];
  const state = fromJS({
    user: {
      filters: {
        cases: checkboxFilter
      }
    }
  });

  const props = {
    recordType: "cases",
    more: true,
    setMore: () => {},
    allAvailable: List(checkboxFilter),
    primaryFilters: fromJS([]),
    defaultFilters: fromJS([]),
    moreSectionFilters: {},
    setMoreSectionFilters: () => {}
  };

  it("renders MoreSection filters", () => {
    const { component } = setupMockFormComponent(MoreSection, props, state);
    const lessButton = component.find("button").at(1);

    expect(lessButton).to.have.lengthOf(1);
    expect(lessButton.text()).to.be.equal("filters.less");
    expect(component.find(MoreSection)).to.have.lengthOf(1);
  });

  it("renders valid props for MoreSection component", () => {
    const { component } = setupMockFormComponent(MoreSection, props);

    const clone = { ...component.find(MoreSection).props() };

    [
      "recordType",
      "more",
      "setMore",
      "allAvailable",
      "primaryFilters",
      "defaultFilters",
      "moreSectionFilters",
      "setMoreSectionFilters",
      "commonInputProps"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("renders valid props for rendered filters", () => {
    const { component } = setupMockFormComponent(MoreSection, props);

    const clone = { ...component.find(CheckboxFilter).props() };

    ["filter", "moreSectionFilters", "setMoreSectionFilters", "mode"].forEach(
      property => {
        expect(clone).to.have.property(property);
        delete clone[property];
      }
    );

    expect(clone).to.be.empty;
  });
});
