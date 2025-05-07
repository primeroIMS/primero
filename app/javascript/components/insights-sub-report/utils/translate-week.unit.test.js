// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format, parseISO } from "date-fns";

import translateWeek from "./translate-week";

describe("translateWeek", () => {
  it("translates the quarter", () => {
    const localizeDate = (value, dateFormat) => format(parseISO(value), dateFormat);
    const result = translateWeek("2020-06-07", "2020-06-13", localizeDate);

    expect(result).toBe("07-Jun-2020 - 13-Jun-2020");
  });
});
