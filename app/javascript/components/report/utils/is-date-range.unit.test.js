// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isDateRange from "./is-date-range";

describe("report/utils/is-date-range.js", () => {
  it("returns dd-MMM-yyyy if the value is a date range", () => {
    expect(isDateRange("01-Jan-2021 - 30-Jan-2021")).toBeTruthy();
  });

  it("returns null if the value is not a valid date", () => {
    expect(isDateRange("")).toBeNull();
  });
});
