// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { convertToNeDate } from "./utils";

describe("components/nepali-calendar-input/utils.js", () => {
  describe("convertToNeDate", () => {
    const isoDate = "2010-01-05T18:30:00Z";

    const expected = "2066-09-21";

    it("converts iso dates", () => {
      expect(convertToNeDate(isoDate)).toEqual(expected);
    });

    it("converts native date object", () => {
      expect(convertToNeDate(new Date(isoDate))).toEqual(expected);
    });

    it("returns empty object", () => {
      expect(convertToNeDate()).toEqual("");
    });
  });
});
