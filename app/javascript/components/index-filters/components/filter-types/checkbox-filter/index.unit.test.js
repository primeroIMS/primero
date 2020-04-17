import index from "./index";

describe("<IndexFilters /> - filter-types/checkbox-filter/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
  });
});
