// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as approvalsConstants from "./constants";

describe("<Approvals /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...approvalsConstants };

    ["CASE_PLAN", "NAME", "NAME_DETAIL", "NAME_PANEL", "NAME_SUMMARY", "STATUS_APPROVED", "STATUS_REJECTED"].forEach(
      property => {
        expect(constants).toHaveProperty(property);
        expect(typeof constants[property]).toBe("string");
        delete constants[property];
      }
    );
    expect(Object.keys(constants)).toHaveLength(0);
  });
});
