import { expect } from "chai";

import * as constants from "./constants";

describe("<RecordList /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "RECORD_LIST_ACTIONS_NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
