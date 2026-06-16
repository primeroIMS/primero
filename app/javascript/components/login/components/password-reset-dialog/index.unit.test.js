import * as indexValues from "./index";

describe("login/components/<PasswordResetDialog /> - index", () => {
  const clone = { ...indexValues };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");

    ["default"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
