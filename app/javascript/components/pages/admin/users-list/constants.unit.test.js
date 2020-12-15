import * as constants from "./constants";

describe("<UsersList /> - constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone).to.be.an("object");
    ["AGENCY", "DISABLED", "LIST_HEADERS", "USER_GROUP"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
