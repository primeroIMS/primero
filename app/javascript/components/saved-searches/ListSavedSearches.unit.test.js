import { List, Map } from "immutable";
import { ListItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import ListSavedSearches from "./ListSavedSearches";
import { SavedSearchesRecord } from "./records";

describe("<ListSavedSearches /> - Component", () => {
  let component;

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

    ({ component } = setupMountedComponent(
      ListSavedSearches,
      {
        recordType: "cases",
        savedSearches: List(savedSearches),
        resetFilters: () => {},
        setTabIndex: () => {},
        setRerender: () => {}
      },
      Map({
        records: Map({
          savedSearches: Map({
            data: savedSearches
          })
        })
      })
    ));
  });

  it("renders 2 ListItem", () => {
    expect(component.find(ListItem)).to.have.lengthOf(2);
  });
});
