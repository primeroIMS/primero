import index from "./index";

describe("<IndexFilters /> - filter-types/toggle-filter/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
  });
});
