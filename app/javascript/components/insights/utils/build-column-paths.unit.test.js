import buildColumnPaths from "./build-column-paths";

describe("<Report /> - utils", () => {
  describe("buildColumnPaths", () => {
    const i18n = { t: () => "total" };

    context("when the columns are an array of strings", () => {
      it("should return the array of paths for the columns", () => {
        const columns = ["column1", "column2"];
        const expected = ["column1.total", "column2.total"];

        expect(buildColumnPaths(columns, i18n)).to.deep.equals(expected);
      });
    });

    context("when the columns are an array of objects", () => {
      it("should return the array of paths for the columns", () => {
        const columns = [
          {
            items: ["column1", "column2"]
          },
          {
            items: ["column3", "column4"]
          }
        ];
        const expected = [
          "column1.column3.total",
          "column1.column4.total",
          "column1.total",
          "column2.column3.total",
          "column2.column4.total",
          "column2.total"
        ];

        expect(buildColumnPaths(columns, i18n)).to.deep.equals(expected);
      });
    });
  });
});
