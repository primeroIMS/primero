import formatColumns from "./format-columns";

describe("<Report /> - utils", () => {
  describe("formatColumns", () => {
    it("should return a the columns translated and formatted", () => {
      const keys = [["6-11"]];
      const columns = [{ display_name: { en: "Age" }, name: "age", position: { type: "vertical", order: 0 } }];
      const i18n = { t: value => value, locale: "en" };

      expect(formatColumns(keys, columns, null, null, i18n)).to.deep.equals([["6-11", "report.total"]]);
    });

    it("return columns using the age range order", () => {
      const keys = [["6 - 11"], ["0 - 5"]];
      const columns = [{ display_name: { en: "Age" }, name: "age", position: { type: "vertical", order: 0 } }];
      const i18n = { t: value => value, locale: "en" };

      expect(formatColumns(keys, columns, ["0 - 5", "6 - 11"], true, i18n)).to.deep.equals([
        ["0 - 5", "6 - 11", "report.total"]
      ]);
    });
  });
});
