import { fromJS } from "immutable";

import { separatorFieldForm } from "./separator-field";

describe("separatorFieldForm", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });
  const separator = separatorFieldForm("test_name", i18n, formMode);
  const generalSection = separator.forms.first().fields;
  const visibilitySection = separator.forms.last().fields[1].row;

  it("should return a valid object", () => {
    expect(separator).to.be.an("object");
    expect(separator.forms.size).to.be.equal(2);
    expect(separator).to.have.keys("forms", "validationSchema");
  });

  it("should return valid fields from the validationSchema", () => {
    expect(separator.validationSchema.fields).to.have.keys("test_name");
  });

  it("should return 4 fields from the general section form", () => {
    expect(generalSection).to.have.lengthOf(4);
  });

  it("should return 4 fields from the visible ection form", () => {
    expect(visibilitySection).to.have.lengthOf(4);
  });
});
