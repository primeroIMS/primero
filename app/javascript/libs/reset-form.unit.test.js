import * as constants from "./reset-form";

describe("reset-form", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone.default).toBeInstanceOf(Function);
    expect(clone.default.name).toBe("resetForm");
    delete clone.default;
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
