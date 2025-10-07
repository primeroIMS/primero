// Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

import { screen, mountedComponent, userEvent, setScreenSizeToMobile } from "test-utils";
import { fromJS } from "immutable";

import IndexFilters from "./component";

describe("<IndexFitlers>", () => {
  beforeAll(() => {
    setScreenSizeToMobile(false);
  });

  const state = fromJS({
    user: {
      filters: {
        cases: [
          {
            name: "cases.filter_by.status",
            field_name: "status",
            option_strings_source: "lookup-case-status",
            options: [],
            type: "checkbox",
            sort_options: false,
            toggle_include_disabled: false
          }
        ]
      }
    }
  });

  const props = {
    recordType: "incidents"
  };

  it("renders search bar", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(document.querySelector("#search-input")).toBeInTheDocument();
  });

  it("renders FilterActions filters", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("filters.apply_filters")).toBeInTheDocument();
    expect(screen.getByText("filters.clear_filters")).toBeInTheDocument();
  });

  it("renders SearchBox", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("navigation.search")).toBeInTheDocument();
    expect(screen.getByText("navigation.phonetic_search.help_text")).toBeInTheDocument();
  });

  it("clear filters button is clicked", async () => {
    const clearFiltersSpy = jest.fn();
    const propFilters = {
      ...props,
      defaultFilters: fromJS({
        record_state: ["true"],
        status: ["open"],
        risk_level: ["medium"]
      }),
      setSelectedRecords: clearFiltersSpy,
      metadata: {}
    };
    const user = userEvent.setup();

    mountedComponent(<IndexFilters {...propFilters} />, state);
    const clearFiltersButton = screen.getByText("filters.clear_filters");

    await user.click(clearFiltersButton);

    expect(clearFiltersSpy).toHaveBeenCalled();
  });
});
