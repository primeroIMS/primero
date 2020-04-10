import { setupMockFormComponent, spy } from "../../../../../test";

import ChipsFilter from "./component";

describe("<ChipsFilter>", () => {
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
    const { component } = setupMockFormComponent(ChipsFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders chip inputs", () => {
    const { component } = setupMockFormComponent(ChipsFilter, props);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );
  });

  it("renders chip as secondary filter, with valid pros in the more section", () => {
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
    const { component } = setupMockFormComponent(ChipsFilter, newProps);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );

    const clone = { ...component.find(ChipsFilter).props() };

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

  it("should have not call setMoreSectionFilters if mode.secondary is false when changing value", () => {
    const newProps = {
      mode: {
        secondary: false
      },
      moreSectionFilters: {},
      setMoreSectionFilters: spy(),
      filter,
      reset: false,
      setReset: () => {}
    };

    const { component } = setupMockFormComponent(ChipsFilter, newProps);
    const chipFilter = component.find("input[type='checkbox']").at(0);

    expect(chipFilter).to.have.lengthOf(1);
    chipFilter.simulate("change", { target: { checked: true } });

    expect(newProps.setMoreSectionFilters).to.have.not.been.called;
  });
});
