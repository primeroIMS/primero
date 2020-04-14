import * as index from "./index";

describe("<ReferralForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    ["default", "SERVICE_SECTION_FIELDS"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.deep.equal({});
  });
});
