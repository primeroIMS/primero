import { fromJS } from "immutable";

import filtersToQueryString from "./filters-to-query-string";

describe("<RecordList />/utils - filtersToQueryString", () => {
  it("returns a query string for the filters object", () => {
    expect(filtersToQueryString(fromJS({ record_state: [true], status: ["open"] }))).to.equals(
      "record_state[0]=true&status[0]=open"
    );
  });

  it("returns a query string with a value for each element in the array of the filter", () => {
    expect(filtersToQueryString(fromJS({ status: ["open", "closed"] }))).to.equals("status[0]=open&status[1]=closed");
  });
});
