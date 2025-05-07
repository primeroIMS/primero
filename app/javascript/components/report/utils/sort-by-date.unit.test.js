// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import sortByDate from "./sort-by-date";

describe("report/utils/sort-by-date.js", () => {
  describe("when multiple is true", () => {
    it("returns ordered array", () => {
      const data = ["Jun-2021", "Feb-2020", "May-2021"];
      const expected = ["Feb-2020", "May-2021", "Jun-2021"];

      expect(sortByDate(data)).toEqual(expected);
    });
  });

  describe("when multiple is false", () => {
    it("returns ordered array", () => {
      const data = [
        ["Jun-2021", 0, 1, 2],
        ["Feb-2020", 1, 0, 0],
        ["May-2021", 3, 2, 1]
      ];
      const expected = [
        ["Feb-2020", 1, 0, 0],
        ["May-2021", 3, 2, 1],
        ["Jun-2021", 0, 1, 2]
      ];

      expect(sortByDate(data, true)).toEqual(expected);
    });
  });

  describe("when is a week", () => {
    it("returns ordered array", () => {
      const data = [
        ["14-May-2018 - 20-May-2018", 0, 1, 2],
        ["24-Aug-2015 - 30-Aug-2015", 1, 0, 0],
        ["08-Oct-2018 - 14-Oct-2018", 3, 2, 1]
      ];
      const expected = [
        ["24-Aug-2015 - 30-Aug-2015", 1, 0, 0],
        ["14-May-2018 - 20-May-2018", 0, 1, 2],
        ["08-Oct-2018 - 14-Oct-2018", 3, 2, 1]
      ];

      expect(sortByDate(data, true)).toEqual(expected);
    });
  });
});
