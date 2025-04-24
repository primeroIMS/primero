// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Transitions /> - Constants - RecordActions", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    // DEPRECATED TRANSFER_ACTIONS_NAME
    expect(clonedConstants).not.toHaveProperty("TRANSFER_ACTIONS_NAME");
    // DEPRECATED REFERRAL_ACTIONS_NAME
    expect(clonedConstants).not.toHaveProperty("REFERRAL_ACTIONS_NAME");

    ["NAME", "REFERRAL_TYPE", "REFERRAL_FORM_ID", "TRANSFER_FORM_ID", "MAX_BULK_RECORDS"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
