// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SAVE_METHODS } from "../../../../../config";

import getFormRequestPath from "./get-form-request-path";

describe("getFormRequestPath", () => {
  it("should return the correct path", () => {
    expect(getFormRequestPath(1, SAVE_METHODS.update)).toBe("forms/1");
  });
});
