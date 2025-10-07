// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<RevokeModal /> - transitions/components/revoke-modal/actions", () => {
  const clone = { ...actions };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "REVOKE_TRANSITION",
      "REVOKE_TRANSITION_STARTED",
      "REVOKE_TRANSITION_SUCCESS",
      "REVOKE_TRANSITION_FINISHED",
      "REVOKE_TRANSITION_FAILURE"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
