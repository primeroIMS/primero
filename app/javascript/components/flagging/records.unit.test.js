// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("Flaggging - records", () => {
  const recordsValues = { ...records };

  it("imports", () => {
    ["FlagRecord"].forEach(property => {
      expect(recordsValues).toHaveProperty(property);
      expect(recordsValues[property]).toBeInstanceOf(Function);

      delete recordsValues[property];
    });

    expect(Object.keys(recordsValues)).toHaveLength(0);
  });
});
