import getColumnData from "./get-column-data";

describe("<Report /> - utils", () => {
  describe("getColumnData", () => {
    it("returns the data for the column when the column is present", () => {
      const column = "Column1";
      const data = {
        Row1: { Column1: { Total: 5 }, Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyColumns = 1;
      const qtyRows = 1;

      expect(getColumnData(column, data, i18n, qtyColumns, qtyRows)).to.deep.equals([5, 5]);
    });

    it("returns 0 when the column is not presnt", () => {
      const column = "Column1";
      const data = {
        Row1: { Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyColumns = 1;
      const qtyRows = 1;

      expect(getColumnData(column, data, i18n, qtyColumns, qtyRows)).to.deep.equals([0, 5]);
    });
  });
});
