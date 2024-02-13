import { Map, List } from "immutable";
import { mountedComponent, screen } from "test-utils";

import SavedSearches from "./component";

describe("<SavedSearches /> - Component", () => {
  beforeEach(() => {
    const props = { recordType: "incidents", resetFilters: () => {} };

    mountedComponent(
      <SavedSearches {...props} />,
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
    );
  });

  it("renders the ListSavedSearches", () => {
    expect(screen.getByText("cases.my_filters")).toBeInTheDocument();
  });
});
