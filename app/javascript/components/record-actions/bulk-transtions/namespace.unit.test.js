import * as namespace from "./namespace";

describe("bulk-transitons - namespace", () => {
  const namespaceValues = { ...namespace };

  it("should have known properties", () => {
    expect(typeof namespaceValues).toEqual("object");
  });
});
