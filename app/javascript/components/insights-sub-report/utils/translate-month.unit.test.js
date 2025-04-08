// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format } from "date-fns";

import translateMonth from "./translate-month";

describe("translateMonth", () => {
  it("translates the month", () => {
    const result = translateMonth("03", format);

    expect(result).toBe("Mar");
  });
});
