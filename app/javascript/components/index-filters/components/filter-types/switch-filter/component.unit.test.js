import { setupMockFormComponent, spy } from "../../../../../test";

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
      mode: {
        secondary: true
      },
      moreSectionFilters: {},
      setMoreSectionFilters: () => {},
      filter,
      reset: false,
      setReset: () => {}
    };
    const { component } = setupMockFormComponent(SwitchFilter, newProps);
    const clone = { ...component.find(SwitchFilter).props() };

    expect(component.exists("input[type='checkbox']")).to.be.true;

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

    const { component } = setupMockFormComponent(SwitchFilter, newProps);
    const switchFilter = component.find("input[type='checkbox']").at(0);

    expect(switchFilter).to.have.lengthOf(1);
    switchFilter.simulate("change", { target: { checked: true } });

    expect(newProps.setMoreSectionFilters).to.have.not.been.called;
  });
});
