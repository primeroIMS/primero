import { expect } from "chai";

import * as constants from "./constants";

describe("<SharedWithMyTeam> - pages/dashboard/components/shared-with-my-team/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
