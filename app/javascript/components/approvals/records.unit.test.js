import { expect } from "../../test";

import * as records from "./records";

describe("Approvals - records", () => {
  const recordsValues = { ...records };

  ["ApprovalsRecord"].forEach(property => {
    expect(recordsValues).to.have.property(property);
    expect(recordsValues[property]).to.be.a("function");

    delete recordsValues[property];
  });

  expect(recordsValues).to.be.empty;
});
