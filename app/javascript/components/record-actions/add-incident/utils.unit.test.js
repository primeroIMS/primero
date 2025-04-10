// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { validationSchema } from "./utils";

describe("record-actions/add-incident/utils", () => {
  const i18n = { locale: "en", t: value => value };

  it("should return the validation schema", () => {
    const subformSection = {
      fields: [{ name: "test1", type: "text_field", required: true, display_name: { en: "Test" } }]
    };
    const result = validationSchema(subformSection, { i18n }).fields.test1;

    expect(typeof result).toEqual("object");
    expect(result.type).toBe("string");
    expect(result.spec.presence).toBe("required");
  });
});
