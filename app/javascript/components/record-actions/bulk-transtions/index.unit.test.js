import index from "./index";

describe("bulk-transitons - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
  });
});
