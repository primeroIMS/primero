// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";

import { mountedFormComponent, screen } from "../../../test-utils";

import MoreSection from "./more-section";

describe("<MoreSection>", () => {
  const checkboxFilter = [
    {
      field_name: "filter1",
      name: "filter1",
      options: [{ id: "true", display_name: "Filter 1" }],
      type: "checkbox"
    }
  ];
  const state = fromJS({
    user: {
      filters: {
        cases: checkboxFilter
      }
    }
  });

  const props = {
    allAvailable: List(checkboxFilter),
    defaultFilters: fromJS([]),
    more: true,
    moreSectionFilters: {},
    primaryFilters: fromJS([]),
    recordType: "cases",
    setMore: () => {},
    setMoreSectionFilters: () => {}
  };

  it("renders MoreSection filters", () => {
    mountedFormComponent(<MoreSection {...props} />, { state, includeFormProvider: true });
    expect(screen.getByText("filters.less")).toBeInTheDocument();
  });
});
