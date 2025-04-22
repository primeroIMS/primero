// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Validations from "./validations";

describe("pages/admin/<RolesForm>/forms - Validations", () => {
  const i18n = { t: () => "" };

  it("returns an object with the fields to validate", () => {
    const validations = Validations(i18n);

    expect(typeof validations.fields.name).toEqual("object");
    expect(typeof validations.fields.permissions).toEqual("object");
  });
});
