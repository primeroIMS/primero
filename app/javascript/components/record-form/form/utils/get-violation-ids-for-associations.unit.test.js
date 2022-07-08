import getViolationIdsForAssociations from "./get-violation-ids-for-associations";

describe("getViolationIdsForAssociations", () => {
  it("when violationID is present should return the violationID", () => {
    expect(getViolationIdsForAssociations("sources", "fde987cda", "abc123edf")).to.be.equal("fde987cda");
  });

  it("when fieldName is NOT responses should return an array", () => {
    expect(getViolationIdsForAssociations("sources", "", "abc123edf")).to.be.deep.equal(["abc123edf"]);
  });

  it("when fieldName is responses should parentUniqueId", () => {
    expect(getViolationIdsForAssociations("responses", "", "abc123edf")).to.be.equal("abc123edf");
  });
});
