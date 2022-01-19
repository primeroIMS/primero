import formatColumns from "./format-columns";

describe("<Report /> - utils", () => {
  describe("formatColumns", () => {
    it("should return a the columns translated and formatted", () => {
      const formattedKeys = ["6-11.Total"];
      const columns = [{ display_name: { en: "Age" }, name: "age", position: { type: "vertical", order: 0 } }];
      const i18n = { t: value => value, locale: "en" };

      expect(formatColumns(formattedKeys, columns, i18n)).to.deep.equals([["6-11", "report.total"]]);
    });
  });
});
