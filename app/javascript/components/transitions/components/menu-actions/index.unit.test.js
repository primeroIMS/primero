import { expect } from "../../../../test";

import * as index from "./index";

describe("<MenuActions /> - transitions/components/menu-actions/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
