// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import buildTallyErrors from "./build-tally-errors";

describe("buildTallyErrors", () => {
  it("should return and array of errors for tallyFields", () => {
    const result = buildTallyErrors({ unknown: "This is an error in unknown", boys: "This is an error in boys" });

    expect(result).toEqual(["This is an error in unknown", "This is an error in boys"]);
  });
});
