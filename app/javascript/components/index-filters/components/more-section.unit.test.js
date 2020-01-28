import { fromJS } from "immutable";

import {
  setupMountedComponent,
  expect,
  setupMockFormComponent
} from "../../../test";

import MoreSection from "./more-section";

describe("<MoreSection>", () => {
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
    recordType: "cases",
    more: true,
    setMore: () => {},
    allAvailable: fromJS([]),
    primaryFilters: fromJS([]),
    defaultFilters: fromJS([]),
    moreSectionFilters: {},
    setMoreSectionFilters: () => {}
  };

  it("renders MoreSection filters", () => {
    const { component } = setupMountedComponent(MoreSection, props, state);
    const lessButton = component.find("button");

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
});
