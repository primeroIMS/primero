import { string } from "yup";

import { validationSchema } from "./validation-schema";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/basic - validation schema", () => {
  const i18n = { t: value => value };

  it("should return the default validation schema", () => {
    const { fields } = validationSchema({
      fieldName: "test_1",
      i18n
    }).fields.test_1;

    expect(Object.keys(fields)).to.deep.equal([
      "display_name",
      "help_text",
      "required"
    ]);
  });

  it("should return the overrided validation schema", () => {
    const { fields } = validationSchema({
      fieldName: "test_1",
      i18n,
      overrides: { name: string() }
    }).fields.test_1;

    expect(Object.keys(fields)).to.deep.equal([
      "display_name",
      "help_text",
      "required",
      "name"
    ]);
  });
});
