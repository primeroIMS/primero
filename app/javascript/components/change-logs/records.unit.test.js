import * as records from "./records";

describe("ChangeLogs - records", () => {
  const recordsValues = { ...records };

  ["ChangeLogsRecord"].forEach(property => {
    expect(recordsValues).to.have.property(property);
    expect(recordsValues[property]).to.be.a("function");

    delete recordsValues[property];
  });

  expect(recordsValues).to.be.empty;
});
