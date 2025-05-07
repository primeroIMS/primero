// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("ChangeLogs - records", () => {
  const recordsValues = { ...records };

  it("exports records", () => {
    ["ChangeLogsRecord"].forEach(property => {
      expect(recordsValues).toHaveProperty(property);
      expect(recordsValues[property]).toBeInstanceOf(Function);

      delete recordsValues[property];
    });

    expect(Object.keys(recordsValues)).toHaveLength(0);
  });
});
