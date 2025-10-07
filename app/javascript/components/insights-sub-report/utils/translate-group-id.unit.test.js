// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format, parseISO } from "date-fns";

import { MONTH, QUARTER, WEEK, YEAR } from "../../insights/constants";

import translateGroupId from "./translate-group-id";

describe("translateGroupId", () => {
  it("translates group of years", () => {
    const result = translateGroupId(2023, YEAR, format);

    expect(result).toBe("2023");
  });

  it("translates group of months", () => {
    const result = translateGroupId("2023-03", MONTH, format);

    expect(result).toBe("Mar-2023");
  });

  it("translates group of quarters", () => {
    const result = translateGroupId("2023-Q1", QUARTER, format);

    expect(result).toBe("Q1-2023");
  });

  it("translates group of weeks", () => {
    const localizeDate = (value, dateFormat) => format(parseISO(value), dateFormat);

    const result = translateGroupId("2023-01-01 - 2023-01-07", WEEK, localizeDate);

    expect(result).toBe("01-Jan-2023 - 07-Jan-2023");
  });
});
