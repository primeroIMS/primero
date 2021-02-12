import * as constants from "./constants";

describe("<CreateRecordDialog /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "FORM_ID"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
