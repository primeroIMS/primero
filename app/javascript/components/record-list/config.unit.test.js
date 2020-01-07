import { expect } from "chai";

import * as config from "./config";

describe("<RecordList /> - config", () => {
  const configValues = { ...config };

  it("should have known properties", () => {
    expect(configValues).to.be.an("object");
    ["NAME", "RECORD_LIST_ACTIONS_NAME"].forEach(property => {
      expect(configValues).to.have.property(property);
      delete configValues[property];
    });
    expect(configValues).to.be.empty;
  });
});
