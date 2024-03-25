// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List, Map } from "immutable";
import { mountedComponent, screen } from "test-utils";

import ListSavedSearches from "./ListSavedSearches";
import { SavedSearchesRecord } from "./records";

describe("<ListSavedSearches /> - Component", () => {
  beforeEach(() => {
    const savedSearches = List([
      SavedSearchesRecord({
        id: 1,
        name: "a new filter",
        record_type: "cases",
        module_ids: List(["primeromodule-cp", "primeromodule-gbv"]),
        filters: List([
          Map({
            name: "Flag",
            value: List(["true", "false"])
          })
        ])
      }),
      SavedSearchesRecord({
        id: 2,
        name: "another filter",
        record_type: "cases",
        module_ids: List(["primeromodule-cp"]),
        filters: List([
          Map({
            name: "status",
            value: List(["open", "closed"])
          })
        ])
      })
    ]);

    const props = {
      recordType: "cases",
      savedSearches: List(savedSearches),
      resetFilters: () => {},
      setTabIndex: () => {},
      setRerender: () => {}
    };

    mountedComponent(
      <ListSavedSearches {...props} />,
      Map({
        records: Map({
          savedSearches: Map({
            data: savedSearches
          })
        })
      })
    );
  });

  it("renders 2 ListItem", () => {
    const listItemText1 = screen.getByText("a new filter");
    const listItemText2 = screen.getByText("another filter");

    expect(listItemText1).toBeInTheDocument();
    expect(listItemText2).toBeInTheDocument();
  });
});
