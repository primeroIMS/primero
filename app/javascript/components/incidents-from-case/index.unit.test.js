import index from "./index";

describe("<IncidentFromCase /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
  });
});
