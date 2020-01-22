import { expect } from "chai";

import * as records from "./records";

describe("Approvals - records", () => {
  const recordsValues = { ...records };

  ["default"].forEach(property => {
    expect(recordsValues).to.have.property(property);
    expect(recordsValues[property]).to.be.a("function");

    delete recordsValues[property];
  });

  expect(recordsValues).to.be.empty;
});
