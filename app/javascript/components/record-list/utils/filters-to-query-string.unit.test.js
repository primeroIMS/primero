// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import filtersToQueryString from "./filters-to-query-string";

describe("<RecordList />/utils - filtersToQueryString", () => {
  it("returns a query string for the filters object", () => {
    expect(filtersToQueryString(fromJS({ record_state: [true], status: ["open"] }))).to.equals(
      "record_state%5B0%5D=true&status%5B0%5D=open"
    );
  });

  it("returns a query string with a value for each element in the array of the filter", () => {
    expect(filtersToQueryString(fromJS({ status: ["open", "closed"] }))).to.equals(
      "status%5B0%5D=open&status%5B1%5D=closed"
    );
  });

  it("returns a query string with a value for each element in the map of the filter", () => {
    expect(filtersToQueryString(fromJS({ date: { from: "2010-01-05", to: "2010-01-08" } }))).to.equals(
      "date%5Bfrom%5D=2010-01-05&date%5Bto%5D=2010-01-08"
    );
  });

  it("returns a query string for a hash with a nested list", () => {
    expect(filtersToQueryString(fromJS({ not: { last_updated_by: ["user1", "user2"] }, status: ["open"] }))).to.equals(
      "not%5Blast_updated_by%5D%5B0%5D=user1&not%5Blast_updated_by%5D%5B1%5D=user2&status%5B0%5D=open"
    );
  });

  it("returns a query string for a list with hashes", () => {
    expect(
      filtersToQueryString(fromJS({ not: [{ user_name: "user1" }, { user_name: "user2" }], status: ["open"] }))
    ).to.equals("not%5B0%5D%5Buser_name%5D=user1&not%5B1%5D%5Buser_name%5D=user2&status%5B0%5D=open");
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
      "user_name%5B0%5D%5B0%5D=user1&user_name%5B0%5D%5B1%5D=user2" +
        "&user_name%5B1%5D%5B0%5D=user3&user_name%5B1%5D%5B1%5D=user4&status%5B0%5D=open"
    );
  });

  it("returns a query string for a date range with positive time zone", () => {
    expect(
      filtersToQueryString(fromJS({ created_at: ["1970-01-01T00:00:00+00:00..2025-02-17T20:04:54+00:00"] }))
    ).to.equals("created_at%5B0%5D=1970-01-01T00%3A00%3A00%2B00%3A00..2025-02-17T20%3A04%3A54%2B00%3A00");
  });
});
