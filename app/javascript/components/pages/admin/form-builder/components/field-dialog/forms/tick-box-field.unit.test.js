import { tickboxFieldForm } from "./tick-box-field";

describe("tickboxFieldForm", () => {
  const i18n = { t: value => value };
  const tickboxContainer = tickboxFieldForm("test_name", i18n);
  const generalSection = tickboxContainer.forms.first().fields;
  const visibilitySection = tickboxContainer.forms.last().fields[1].row;

  it("should return a valid object", () => {
    expect(tickboxContainer).to.be.an("object");
    expect(tickboxContainer.forms.size).to.be.equal(2);
    expect(tickboxContainer).to.have.keys("forms", "validationSchema");
  });

  it("should return valid fields from the validationSchema", () => {
    expect(tickboxContainer.validationSchema.fields).to.have.keys("test_name");
  });

  it("should return 5 fields from the general section form", () => {
    expect(generalSection).to.have.lengthOf(5);
  });

  it("should return 4 fields from the visible ection form", () => {
    expect(visibilitySection).to.have.lengthOf(4);
  });
});
