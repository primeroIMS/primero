import * as utils from "./utils";

describe("components/report/components/utils.js", () => {
  describe("utils", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["escapeCsvText", "downloadFile", "tableToCsv"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).to.have.property(property);
        delete clone[property];
      });
    });
  });

  describe("escapeCsvText", () => {
    it("returns a escaped text for csv", () => {
      expect(utils.escapeCsvText('"GBV" Survivor')).to.equals('"""GBV"" Survivor"');
      expect(utils.escapeCsvText("Survivor, Proctected and Released")).to.equals('"Survivor, Proctected and Released"');
    });
  });
});
