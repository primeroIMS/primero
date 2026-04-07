import * as index from "./index";

describe("layouts/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    ["AppLayout", "LoginLayout", "EmptyLayout"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
