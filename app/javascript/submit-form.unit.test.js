import { expect } from "chai";

import constants from "./submit-form";

describe("submit-form", () => {
  it("should have known properties", () => {
    expect(constants).to.be.a("function");
    expect(constants.name).to.be.equals("submitForm");
  });
});
