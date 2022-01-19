import getRowsTableData from "./get-rows-table-data";

describe("report/utils/get-rows-table-data", () => {
  describe("getRowsTableData", () => {
    it("should return the correct rows if the data is not in english", () => {
      const i18n = {
        t: value => (value === "report.total" ? "Gesamt" : value)
      };
      const data = {
        fields: [{ name: "Sex", position: { type: "horizontal" } }],
        report_data: {
          Weiblich: { Gesamt: 5 }
        }
      };

      expect(getRowsTableData(data, ["Gesamt"], i18n)).to.deep.equal([["Weiblich", false, 5]]);
    });
  });
});
