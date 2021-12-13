import sample from "lodash/sample";

import { CASES, INCIDENTS, VIOLATIONS_FORM, VIOLATIONS_SUBFORM_UNIQUE_IDS } from "../../../../config";

import isViolationSubform from "./is-violation-subform";

describe("isViolationSubform", () => {
  context("when useSubformUniqueId is true", () => {
    it("shourl return false if unique_id is not violation form", () => {
      expect(isViolationSubform(CASES, "test", true)).to.be.false;
    });
    it("shourl return true if unique_id is not violation form", () => {
      expect(isViolationSubform(INCIDENTS, sample(VIOLATIONS_SUBFORM_UNIQUE_IDS), true)).to.be.true;
    });
  });
  context("when useSubformUniqueId is false", () => {
    it("shourl return false if unique_id is not violation form", () => {
      expect(isViolationSubform(CASES, "test", false)).to.be.false;
    });
    it("shourl return true if unique_id is not violation form", () => {
      expect(isViolationSubform(INCIDENTS, sample(VIOLATIONS_FORM), false)).to.be.true;
    });
  });
});
