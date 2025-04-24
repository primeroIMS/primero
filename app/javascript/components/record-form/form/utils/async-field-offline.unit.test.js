// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { CUSTOM_STRINGS_SOURCE } from "../constants";

import asyncFieldOffline from "./async-field-offline";

describe("asyncFieldOffline", () => {
  it("returns false when online and options uses endpoint", () => {
    expect(asyncFieldOffline(true, CUSTOM_STRINGS_SOURCE.agency)).toBe(false);
  });

  it("returns true when not online and options uses endpoint", () => {
    expect(asyncFieldOffline(false, CUSTOM_STRINGS_SOURCE.agency)).toBe(true);
  });

  it("returns false when online and options does not use endpoint", () => {
    expect(asyncFieldOffline(true, "none-api-option-source")).toBe(false);
  });

  it("returns false when offline and options does not use endpoint and required true", () => {
    expect(asyncFieldOffline(false, "none-api-option-source")).toBe(false);
  });
});
