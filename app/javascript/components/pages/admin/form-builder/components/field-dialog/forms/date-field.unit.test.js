// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    expect(typeof date).toEqual("object");
    expect(date.forms.size).toBe(2);
    expect(Object.keys(date)).toEqual(expect.arrayContaining(["forms", "validationSchema"]));
  });

  it("should return valid fields from the validationSchema", () => {
    expect(Object.keys(date.validationSchema.fields)).toContain("test_name");
  });

  it("should return 8 fields from the general section form", () => {
    expect(generalSection).toHaveLength(9);
  });

  it("should return 5 fields from the visible section form", () => {
    expect(visibilitySection).toHaveLength(5);
  });
});
