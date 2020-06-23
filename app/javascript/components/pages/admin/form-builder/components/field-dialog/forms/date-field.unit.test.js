import { fromJS } from "immutable";

import { dateFieldForm } from "./date-field";

describe("dateFieldForm", () => {
  const i18n = { t: value => value };
  const field = fromJS({
    name: "test_name",
    date_include_time: false
  });
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });
  const date = dateFieldForm({
    field,
    i18n,
    css: { hiddenField: "" },
    formMode
  });
  const generalSection = date.forms.first().fields;
  const visibilitySection = date.forms.last().fields[1].row;

  it("should return a valid object", () => {
    expect(date).to.be.an("object");
    expect(date.forms.size).to.be.equal(2);
    expect(date).to.have.keys("forms", "validationSchema");
  });

  it("should return valid fields from the validationSchema", () => {
    expect(date.validationSchema.fields).to.have.keys("test_name");
  });

  it("should return 8 fields from the general section form", () => {
    expect(generalSection).to.have.lengthOf(8);
  });

  it("should return 4 fields from the visible ection form", () => {
    expect(visibilitySection).to.have.lengthOf(4);
  });
});
