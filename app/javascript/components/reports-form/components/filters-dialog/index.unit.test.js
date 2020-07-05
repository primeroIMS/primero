import index from "./index";

describe("<ReportFiltersDialog /> - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
  });
});
