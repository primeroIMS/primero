// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<RevokeModal /> - transitions/components/revoke-modal/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    ["NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
