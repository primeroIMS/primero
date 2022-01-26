import sortByDate from "./sort-by-date";

describe("report/utils/sort-by-date.js", () => {
  describe("when multiple is true", () => {
    it("returns ordered array", () => {
      const data = ["Jun-2021", "Feb-2020", "May-2021"];
      const expected = ["Feb-2020", "May-2021", "Jun-2021"];

      expect(sortByDate(data)).to.deep.equals(expected);
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

      expect(sortByDate(data, true)).to.deep.equals(expected);
    });
  });
});
