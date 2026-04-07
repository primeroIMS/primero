import index from "./index";

describe("<IndexFilters /> - filter-types/checkbox-filter/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
  });
});
