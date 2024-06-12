// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { MODULES } from "../../../config";
import { mountedFormComponent, screen } from "../../../test-utils";

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

    mountedFormComponent(<TabFilters {...defaultProps} />, { state });

    expect(screen.queryByTestId("filter-category")).not.toBeInTheDocument();
  });

  it("renders a FilterCategory if the module is MRM", () => {
    const state = fromJS({ user: { modules: [MODULES.MRM] } });

    mountedFormComponent(<TabFilters {...defaultProps} />, { state });

    expect(screen.queryByTestId("filter-category")).toBeInTheDocument();
  });

  it("does not renders a FilterCategory if the recordType is not incident", () => {
    const state = fromJS({ user: { modules: [MODULES.MRM] } });

    mountedFormComponent(<TabFilters {...{ ...defaultProps, recordType: "cases" }} />, { state });

    expect(screen.queryByTestId("filter-category")).not.toBeInTheDocument();
  });
});
