import { setupMockFormComponent, expect, spy } from "../../../../../test";

import CheckboxFilter from "./component";

describe("<CheckboxFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: [
      { id: "option-1", display_text: "Option 1" },
      { id: "option-2", display_text: "Option 2" }
    ]
  };

  const props = { filter };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(CheckboxFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders checkbox inputs", () => {
    const { component } = setupMockFormComponent(CheckboxFilter, props);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );
  });

  it("renders checkbox as secondary filter, with valid pros in the more section", () => {
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
    const { component } = setupMockFormComponent(CheckboxFilter, newProps);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );

    const clone = { ...component.find(CheckboxFilter).props() };

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
