// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import formatAgeRange from "./format-age-range";

describe("formatAgeRange", () => {
  it("formats the age ranges", () => {
    const range = formatAgeRange("0..9");

    expect(range).toBe("0 - 9");
  });
});
