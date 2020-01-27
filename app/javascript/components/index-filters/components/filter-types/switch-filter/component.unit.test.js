import { setupMockFormComponent, expect } from "../../../../../test";

import SwitchFilter from "./component";

describe("<SwitchFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: {
      en: [
        {
          id: "true",
          display_name: "Option 1"
        }
      ]
    }
  };

  const props = {
    filter
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(SwitchFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders switch", () => {
    const { component } = setupMockFormComponent(SwitchFilter, props);

    expect(component.exists("input[type='checkbox']")).to.be.true;
  });

  it("renders switch as secondary filter, with valid pros in the more section", () => {
    const newProps = {
      isSecondary: true,
      moreSectionFilters: {},
      setMoreSectionFilters: () => {},
      filter
    };
    const { component } = setupMockFormComponent(SwitchFilter, newProps);
    const clone = { ...component.find(SwitchFilter).props() };

    expect(component.exists("input[type='checkbox']")).to.be.true;

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
