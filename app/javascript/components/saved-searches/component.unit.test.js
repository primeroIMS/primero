import { Map, List } from "immutable";

import { setupMountedComponent } from "../../test";

import ListSavedSearches from "./ListSavedSearches";
import SavedSearches from "./component";

describe("<SavedSearches /> - Component", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      SavedSearches,
      { recordType: "incidents", resetFilters: () => {} },
      Map({
        records: Map({
          savedSearches: Map({
            data: List([
              {
                name: "a new filter",
                record_type: "incidents",
                module_ids: List(["primeromodule-cp", "primeromodule-gbv"]),
                filters: List([
                  Map({
                    name: "Flag",
                    value: List(["true", "false"])
                  })
                ])
              }
            ])
          })
        })
      })
    ).component;
  });

  it("renders the ListSavedSearches", () => {
    expect(component.find(ListSavedSearches)).to.have.length(1);
  });
});
