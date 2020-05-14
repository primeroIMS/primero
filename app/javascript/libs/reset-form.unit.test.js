import * as constants from "./reset-form";

describe("reset-form", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone.default).to.be.a("function");
    expect(clone.default.name).to.be.equals("resetForm");
    delete clone.default;
    expect(clone).to.be.empty;
  });
});
