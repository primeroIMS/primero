// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import sample from "lodash/sample";

import { CASES, INCIDENTS, VIOLATIONS_FORM, VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../../../config";

import isViolationSubform from "./is-violation-subform";

describe("isViolationSubform", () => {
  describe("when useSubformUniqueId is true", () => {
    it("shourl return false if unique_id is not violation form", () => {
      expect(isViolationSubform(CASES, "test", true)).toBe(false);
    });
    it("shourl return true if unique_id is not violation form", () => {
      expect(isViolationSubform(INCIDENTS, sample(VIOLATIONS_SUBFORM_UNIQUE_IDS), true)).toBe(true);
    });
  });
  describe("when useSubformUniqueId is false", () => {
    it("shourl return false if unique_id is not violation form", () => {
      expect(isViolationSubform(CASES, "test", false)).toBe(false);
    });
    it("shourl return true if unique_id is not violation form", () => {
      expect(isViolationSubform(INCIDENTS, sample(VIOLATIONS_FORM), false)).toBe(true);
    });
  });
});
