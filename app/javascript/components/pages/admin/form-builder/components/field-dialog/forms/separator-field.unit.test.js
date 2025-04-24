// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { separatorFieldForm } from "./separator-field";

describe("separatorFieldForm", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });
  const separator = separatorFieldForm({
    field: fromJS({ name: "test_name" }),
    i18n,
    formMode
  });
  const generalSection = separator.forms.first().fields;
  const visibilitySection = separator.forms.last().fields[1].row;

  it("should return a valid object", () => {
    expect(typeof separator).toEqual("object");
    expect(separator.forms.size).toBe(2);
    expect(Object.keys(separator)).toEqual(expect.arrayContaining(["forms", "validationSchema"]));
  });

  it("should return valid fields from the validationSchema", () => {
    expect(Object.keys(separator.validationSchema.fields)).toContain("test_name");
  });

  it("should return 4 fields from the general section form", () => {
    expect(generalSection).toHaveLength(3);
  });

  it("should return 4 fields from the visible ection form", () => {
    expect(visibilitySection).toHaveLength(5);
  });
});
