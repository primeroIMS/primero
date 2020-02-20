import { expect } from "../../../../test";

import * as constants from "./constants";

describe("<MenuActions /> - transitions/components/menu-actions/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "REVOKE_MODAL"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
