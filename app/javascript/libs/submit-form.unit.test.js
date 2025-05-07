// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./submit-form";

describe("submit-form", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone.default).toBeInstanceOf(Function);
    expect(clone.default.name).toBe("submitForm");
    delete clone.default;
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
