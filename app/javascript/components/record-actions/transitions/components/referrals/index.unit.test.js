import * as index from "./index";

describe("<ReferralForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    ["default", "SERVICE_SECTION_FIELDS"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(indexValues).toEqual({});
  });
});
