import * as namespace from "./namespace";

describe("ChangeLogs - namespace", () => {
  const namespaceValues = { ...namespace };

  it("should have known properties", () => {
    expect(typeof namespaceValues).toEqual("object");
  });
});
