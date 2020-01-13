import { expect } from "chai";

import * as constants from "./submit-form";

describe("submit-form", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone.default).to.be.a("function");
    expect(clone.default.name).to.be.equals("submitForm");
    delete clone.default;
    expect(clone).to.be.empty;
  });
});
