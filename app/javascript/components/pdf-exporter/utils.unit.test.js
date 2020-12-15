import * as utils from "./utils";

describe("components/exports/components/pdf-exporter/utils.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["addPageHeaderFooter", "buildHeaderImage"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });
});
