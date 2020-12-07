import * as form from "./form";

describe("pages/password-reset - form", () => {
  const i18n = { t: value => value };

  it("should have known properties", () => {
    const indexValues = { ...form };

    ["form", "validationSchema"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });

  it("'validationSchema' should return an objectto.be.an('object')", () => {
    expect(form.validationSchema(i18n)).to.be.an("object");
  });

  it("'form' should return an objectto.be.an('object')", () => {
    expect(form.form(i18n, () => {})).to.be.an("object");
  });
});
