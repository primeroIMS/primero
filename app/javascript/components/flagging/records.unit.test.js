// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("Flaggging - records", () => {
  const recordsValues = { ...records };

  ["FlagRecord"].forEach(property => {
    expect(recordsValues).to.have.property(property);
    expect(recordsValues[property]).to.be.a("function");

    delete recordsValues[property];
  });

  expect(recordsValues).to.be.empty;
});
