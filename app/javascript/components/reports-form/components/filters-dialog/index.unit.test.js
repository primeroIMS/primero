import index from "./index";

describe("<ReportFiltersDialog /> - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
  });
});
