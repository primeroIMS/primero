import { expect } from "test/test.setup";
import { Map } from "immutable";
import { CASES_ASSIGNS, CASES_REFERRALS, CASES_TRANSFERS } from "config";
import {
  getInternalFields,
  internalFieldsDirty,
  hasProvidedConsent,
  generatePath
} from "./helpers";

describe("<Transition /> - helper", () => {
  describe("with internalFieldsDirty", () => {
    const fields = ["agency"];
    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };
      expect(internalFieldsDirty(values, fields)).to.be.equal(true);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };
      expect(internalFieldsDirty(values, fields)).to.be.equal(false);
    });
  });

  describe("with getInternalFields", () => {
    const fields = ["agency"];
    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };
      expect(getInternalFields(values, fields)).to.deep.equal(values);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };
      expect(getInternalFields(values, fields)).to.deep.equal({});
    });
  });

  describe("with hasProvidedConsent", () => {
    describe("when record has provided consent", () => {
      const record = Map({
        id: "123",
        module_id: "primeromodule-cp",
        consent_for_services: true
      });
      it("should return true", () => {
        expect(hasProvidedConsent(record)).to.equal(true);
      });
    });
    describe("when record has not provided consent", () => {
      const record = Map({
        id: "123",
        module_id: "primeromodule-cp"
      });
      it("should return false", () => {
        expect(hasProvidedConsent(record)).to.be.undefined;
      });
    });
  });

  describe("with generatePath", () => {
    const recordId = "123";
    describe("when path is assigns", () => {
      const expected = "cases/123/assigns";
      it("should return correct path 'cases/123/assigns'", () => {
        expect(generatePath(CASES_ASSIGNS, recordId)).to.equal(expected);
      });
    });
    describe("when path is transfers", () => {
      const expected = "cases/123/transfers";
      it("should return correct path 'cases/123/transfers'", () => {
        expect(generatePath(CASES_TRANSFERS, recordId)).to.equal(expected);
      });
    });
    describe("when path is referral", () => {
      const expected = "cases/123/referrals";
      it("should return correct path 'cases/123/referrals'", () => {
        expect(generatePath(CASES_REFERRALS, recordId)).to.equal(expected);
      });
    });
  });
});
