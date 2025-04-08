// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getViolationIdsForAssociations from "./get-violation-ids-for-associations";

describe("getViolationIdsForAssociations", () => {
  it("when violationID is present should return the violationID", () => {
    expect(getViolationIdsForAssociations("sources", "fde987cda", "abc123edf")).toBe("fde987cda");
  });

  it("when fieldName is NOT responses should return an array", () => {
    expect(getViolationIdsForAssociations("sources", "", "abc123edf")).toEqual(["abc123edf"]);
  });

  it("when fieldName is responses should parentUniqueId", () => {
    expect(getViolationIdsForAssociations("responses", "", "abc123edf")).toBe("abc123edf");
  });
});
