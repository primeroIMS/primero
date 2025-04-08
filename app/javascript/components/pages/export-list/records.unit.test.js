// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("<ExportList/> - pages/export-list/records", () => {
  const clone = { ...records };

  it("should have known exported properties", () => {
    ["ExportRecord"].forEach(property => {
      expect(clone).toHaveProperty(property);
      expect(clone[property]).toBeInstanceOf(Function);
      delete clone[property];
    });
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
