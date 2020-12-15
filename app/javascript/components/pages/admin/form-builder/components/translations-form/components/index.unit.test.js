import * as index from "./index";

describe("pages/admin/<FormBuilder>/components/<TranslationsForm>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["FieldTranslationRow"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
