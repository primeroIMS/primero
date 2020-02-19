import Autocomplete from "@material-ui/lab/Autocomplete";

import { setupMockFormComponent, expect, spy } from "../../../../../test";

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
      mode: {
        secondary: true
      },
      moreSectionFilters: {},
      setMoreSectionFilters: () => {},
      filter,
      reset: false,
      setReset: () => {}
    };
    const { component } = setupMockFormComponent(SelectFilter, newProps);
    const clone = { ...component.find(SelectFilter).props() };

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

  it("should have not call setMoreSectionFilters if mode.secondary is false when changing value", () => {
    const newProps = {
      mode: {
        secondary: false
      },
      moreSectionFilters: {},
      setMoreSectionFilters: spy(),
      filter,
      reset: false,
      setReset: () => {},
      isDateFieldSelectable: true
    };

    const { component } = setupMockFormComponent(SelectFilter, newProps);

    const select = component.find(Autocomplete);

    expect(select).to.have.lengthOf(1);
    select.props().onChange({}, [{ id: "option-2", display_text: "Option 2" }]);

    expect(newProps.setMoreSectionFilters).to.have.not.been.called;
  });
});
