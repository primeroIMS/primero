import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../test";
import { MODULES } from "../../../config";

import FilterCategory from "./filter-category";
import TabFilters from "./tab-filters";

describe("components/index-filters/<TabFilters>", () => {
  const defaultProps = {
    addFilterToList: () => {},
    defaultFilters: [],
    filterToList: {},
    handleClear: () => {},
    handleSave: () => {},
    more: false,
    moreSectionFilters: {},
    queryParams: {},
    recordType: "incidents",
    reset: false,
    setMore: () => {},
    setMoreSectionFilters: () => {},
    setReset: () => {}
  };

  it("does not render a FilterCategory if the module is not MRM", () => {
    const state = fromJS({ user: { modules: [MODULES.CP] } });
    const { component } = setupMockFormComponent(TabFilters, { props: defaultProps, state });

    expect(component.find(FilterCategory)).to.be.empty;
  });

  it("renders a FilterCategory if the module is MRM", () => {
    const state = fromJS({ user: { modules: [MODULES.MRM] } });
    const { component } = setupMockFormComponent(TabFilters, { props: defaultProps, state });

    expect(component.find(FilterCategory)).to.have.lengthOf(1);
  });

  it("does not renders a FilterCategory if the recordType is not incident", () => {
    const state = fromJS({ user: { modules: [MODULES.MRM] } });
    const { component } = setupMockFormComponent(TabFilters, {
      props: { ...defaultProps, recordType: "cases" },
      state
    });

    expect(component.find(FilterCategory)).to.be.empty;
  });
});
