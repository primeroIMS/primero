import { screen, mountedComponent } from "test-utils";
import { fromJS } from "immutable";

import IndexFilters from "./component";

describe("<IndexFitlers>", () => {
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
    recordType: "cases"
  };

  it("renders search bar", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(document.querySelector("#search-input")).toBeInTheDocument();
  });

  it("renders MoreSection filters", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("filters.more")).toBeInTheDocument();
  });

  it("renders FilterActions filters", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("filters.apply_filters")).toBeInTheDocument();
  });

  // need to be work on this
  // it("clear filters", async () => {
  //     const propFilters = {
  //         ...props,
  //         defaultFilters: fromJS({
  //             record_state: ["true"],
  //             status: ["open"],
  //             risk_level: ["medium"]
  //         }),
  //         setSelectedRecords: () => { },
  //         metadata: {}
  //     };

  //     const { store } = mountedComponent(<IndexFilters {...propFilters} />, state, [
  //         "/cases?record_state[0]=true&status[0]=open&risk_level[0]=medium&page=1&per=20"
  //     ]);
  //     const user = userEvent.setup()
  //     expect(store.getActions()).toEqual([]);
  //     await user.click(screen.getAllByRole('button')[0]);
  //     expect(store.getActions()[0]).toEqual({
  //         type: "cases/SET_FILTERS",
  //         payload: { fields: "short", status: ["open"], record_state: ["true"] }
  //     });
  // });
});
