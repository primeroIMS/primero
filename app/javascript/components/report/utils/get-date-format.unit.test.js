// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getDateFormat from "./get-date-format";

describe("report/utils/get-date-format.js", () => {
  it("returns MMM-yyyy", () => {
    expect(getDateFormat("Jan-2021")).toBe("MMM-yyyy");
  });

  it("returns dd-MMM-yyyy", () => {
    expect(getDateFormat("01-Jan-2021")).toBe("dd-MMM-yyyy");
  });

  it("returns dd-MMM-yyyy if the value is a date range", () => {
    expect(getDateFormat("01-Jan-2021 - 30-Jan-2021")).toBe("dd-MMM-yyyy");
  });

  it("returns null if the value is not a valid date", () => {
    expect(getDateFormat("")).toBeNull();
  });
});
