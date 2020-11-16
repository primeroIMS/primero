import { emptyColumn } from "./utils";

describe("<TableValues/> - components/utils", () => {
  describe("emptyColumn", () => {
    const i18n = {
      t: value => value
    };

    describe("when withoutTotal is false", () => {
      const result = emptyColumn(i18n);

      it("returns an array of two elements", () => {
        expect(result).to.have.lengthOf(2);
      });
      it("returns the last element with total label", () => {
        expect(result[1]).to.be.equals("report.total");
      });
    });

    describe("when withoutTotal is true", () => {
      it("returns an array with a single and empty element", () => {
        const result = emptyColumn(i18n, true);

        expect(result[0]).to.be.empty;
        expect(result).to.have.lengthOf(1);
      });
    });
  });
});
