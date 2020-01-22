import { expect } from "chai";

import * as records from "./records";

describe("Record-form - records", () => {
  const recordsValues = { ...records };

  ["FieldRecord", "FormSectionRecord", "Option", "NavRecord"].forEach(
    property => {
      expect(recordsValues).to.have.property(property);
      expect(recordsValues[property]).to.be.a("function");

      delete recordsValues[property];
    }
  );

  expect(recordsValues).to.be.empty;
});
