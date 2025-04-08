// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format } from "date-fns";

import translateQuarter from "./translate-quarter";

describe("translateQuarter", () => {
  it("translates the quarter", () => {
    const result = translateQuarter("Q3", format);

    expect(result).toBe("Q3");
  });
});
