// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as componentsConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...componentsConstants };

    [
      "CLOSED",
      "GUIDING_QUESTIONS_NAME",
      "SYNC_RECORD_NAME",
      "SYNC_RECORD_STATUS",
      "VALIDATION_ERRORS_NAME",
      "WORKFLOW_INDICATOR_NAME"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(constants).toEqual({});
  });
});
