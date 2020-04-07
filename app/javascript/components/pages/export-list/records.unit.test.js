import * as records from "./records";

describe("<ExportList/> - pages/export-list/records", () => {
  const clone = { ...records };

  it("should have known exported properties", () => {
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      expect(clone[property]).to.be.a("function");
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
