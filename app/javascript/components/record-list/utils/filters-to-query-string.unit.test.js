// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

  it("returns a query string with a value for each element in the map of the filter", () => {
    expect(filtersToQueryString(fromJS({ date: { from: "2010-01-05", to: "2010-01-08" } }))).to.equals(
      "date[from]=2010-01-05&date[to]=2010-01-08"
    );
  });

  it("returns a query string for a hash with a nested list", () => {
    expect(filtersToQueryString(fromJS({ not: { last_updated_by: ["user1", "user2"] }, status: ["open"] }))).to.equals(
      "not[last_updated_by][0]=user1&not[last_updated_by][1]=user2&status[0]=open"
    );
  });

  it("returns a query string for a list with hashes", () => {
    expect(
      filtersToQueryString(fromJS({ not: [{ user_name: "user1" }, { user_name: "user2" }], status: ["open"] }))
    ).to.equals("not[0][user_name]=user1&not[1][user_name]=user2&status[0]=open");
  });

  it("returns a query string for a list with nested lists", () => {
    expect(
      filtersToQueryString(
        fromJS({
          user_name: [
            ["user1", "user2"],
            ["user3", "user4"]
          ],
          status: ["open"]
        })
      )
    ).to.equals(
      "user_name[0][0]=user1&user_name[0][1]=user2&user_name[1][0]=user3&user_name[1][1]=user4&status[0]=open"
    );
  });
});
