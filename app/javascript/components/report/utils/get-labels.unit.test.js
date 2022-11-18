import getLabels from "./get-labels";

describe("<Report /> - utils", () => {
  describe("getLabels", () => {
    it("returns the labels translated when some columns all columsn are present", () => {
      const columns = ["Column1", "Column2"];
      const data = {
        Row1: { Column1: { Total: 5 }, Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyColumns = 1;
      const qtyRows = 1;
      const fields = [];

      expect(getLabels(columns, data, i18n, fields, qtyColumns, qtyRows, {})).to.deep.equal(["Row1", "Row2"]);
    });

    it("returns the labels translated when some columns are not present", () => {
      const columns = ["Column1", "Column2"];
      const data = {
        Row1: { Column1: { Total: 5 }, Total: 5 },
        Row2: { Column2: { Total: 5 }, Total: 5 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyColumns = 1;
      const qtyRows = 1;
      const fields = [];

      expect(getLabels(columns, data, i18n, fields, qtyColumns, qtyRows, {})).to.deep.equal(["Row1", "Row2"]);
    });
  });
});
