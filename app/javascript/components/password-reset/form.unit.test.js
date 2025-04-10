// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as form from "./form";

describe("pages/password-reset - form", () => {
  const i18n = { t: value => value };

  it("should have known properties", () => {
    const indexValues = { ...form };

    ["form", "validationSchema"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });

  it("'validationSchema' should return an objectto.be.an('object')", () => {
    expect(typeof form.validationSchema(i18n)).toEqual("object");
  });

  it("'form' should return an objectto.be.an('object')", () => {
    expect(typeof form.form(i18n, () => {})).toEqual("object");
  });
});
