import * as constants from "./constants";

describe("<RecordActions /> - exports/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "ALL_EXPORT_TYPES", "EXPORT_FORMAT"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
