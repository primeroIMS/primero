// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("RequestApproval /> - components/record-actions/request-approval", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["APPROVAL_FORM", "APPROVAL_STATUS", "APPROVAL_TYPE_LOOKUP", "CASE_PLAN", "NAME"].forEach(property => {
      expect(constantsValues).toHaveProperty(property);

      delete constantsValues[property];
    });

    expect(Object.keys(constantsValues)).toHaveLength(0);
  });
});
