// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { tickboxFieldForm } from "./tick-box-field";

describe("tickboxFieldForm", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });
  const tickboxContainer = tickboxFieldForm({
    field: fromJS({ name: "test_name" }),
    i18n,
    formMode
  });
  const generalSection = tickboxContainer.forms.first().fields;
  const visibilitySection = tickboxContainer.forms.last().fields[1].row;

  it("should return a valid object", () => {
    expect(typeof tickboxContainer).toEqual("object");
    expect(tickboxContainer.forms.size).toBe(2);
    expect(Object.keys(tickboxContainer)).toEqual(expect.arrayContaining(["forms", "validationSchema"]));
  });

  it("should return valid fields from the validationSchema", () => {
    expect(Object.keys(tickboxContainer.validationSchema.fields)).toContain("test_name");
  });

  it("should return 5 fields from the general section form", () => {
    expect(generalSection).toHaveLength(6);
  });

  it("should return 4 fields from the visible ection form", () => {
    expect(visibilitySection).toHaveLength(5);
  });
});
