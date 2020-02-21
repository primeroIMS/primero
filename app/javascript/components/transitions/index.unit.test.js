import { expect } from "../../test";

import * as index from "./index";

describe("<Transitions /> - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "fetchTransitions",
      "reducer",
      "reducers",
      "selectTransitions",
      "selectTransitionByTypeAndStatus",
      "Transitions"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
