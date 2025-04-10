// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("pages/admin/forms-list/components/form-exporter/constants", () => {
  const clone = { ...constants };

  afterAll(() => {
    expect(Object.keys(clone)).toHaveLength(0);
  });

  ["NAME", "FORM_EXPORTER_DIALOG", "EXPORT_TYPES", "EXPORT_FORMS_PATH", "EXPORTED_URL", "FORM_ID"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
  });

  describe("with EXPORT_TYPES", () => {
    it("should contains valid keys", () => {
      expect(Object.keys(constants.EXPORT_TYPES)).toContain("EXCEL");
    });
  });
});
