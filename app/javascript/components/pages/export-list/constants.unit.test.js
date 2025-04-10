// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ExportList /> - pages/export-list/constants", () => {
  it("should have known constants", () => {
    const clone = { ...constants };

    ["NAME", "EXPORT_URL", "EXPORT_STATUS", "EXPORT_COLUMNS"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
