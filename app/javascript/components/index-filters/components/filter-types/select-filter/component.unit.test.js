import { setupMockFormComponent, expect } from "../../../../../test";

import SelectFilter from "./component";

describe("<SelectFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: [
      { id: "option-1", display_text: "Option 1" },
      { id: "option-2", display_text: "Option 2" }
    ]
  };

  const props = {
    filter
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(SelectFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders select as secondary filter, with valid pros in the more section", () => {
    const newProps = {
      isSecondary: true,
      moreSectionFilters: {},
      setMoreSectionFilters: () => {},
      filter
    };
    const { component } = setupMockFormComponent(SelectFilter, newProps);
    const clone = { ...component.find(SelectFilter).props() };

    expect(component.exists("Panel")).to.be.true;

    [
      "isSecondary",
      "moreSectionFilters",
      "setMoreSectionFilters",
      "filter",
      "commonInputProps"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
