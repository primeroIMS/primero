// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import checkValue from "./check-value";

describe("<ReportForm>/utils/checkValue()", () => {
  it("should return a formatted date string", () => {
    const filter = {
      value: new Date("01/01/2020")
    };

    expect(checkValue(filter)).toBe("01-Jan-2020");
  });

  it("should return a string", () => {
    const filter = {
      value: "test"
    };

    expect(checkValue(filter)).toBe("test");
  });
});
