import * as constants from "./constants";

describe("pages/admin/forms-list/components/form-exporter/constants", () => {
  const clone = { ...constants };

  after(() => {
    expect(clone).to.be.empty;
  });

  ["NAME", "FORM_EXPORTER_DIALOG", "EXPORT_TYPES", "EXPORT_FORMS_PATH", "EXPORTED_URL", "FORM_ID"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });

  describe("with EXPORT_TYPES", () => {
    it("should contains valid keys", () => {
      expect(constants.EXPORT_TYPES).to.have.keys("EXCEL");
    });
  });
});
