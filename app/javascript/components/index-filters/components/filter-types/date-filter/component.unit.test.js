import { setupMockFormComponent, expect } from "../../../../../test";

import DateFilter from "./component";

describe("<DateFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: {
      en: [
        { id: "option-1", display_text: "Option 1" },
        { id: "option-2", display_text: "Option 2" }
      ]
    }
  };

  const props = {
    filter
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(DateFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders date-filter as secondary filter, with valid pros in the more section", () => {
    const newProps = {
      mode: {
        secondary: true
      },
      moreSectionFilters: {},
      setMoreSectionFilters: () => {},
      filter,
      reset: false,
      setReset: () => {}
    };
    const { component } = setupMockFormComponent(DateFilter, newProps);
    const clone = { ...component.find(DateFilter).props() };

    expect(component.exists("Panel")).to.be.true;

    [
      "commonInputProps",
      "filter",
      "mode",
      "moreSectionFilters",
      "reset",
      "setMoreSectionFilters",
      "setReset"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
