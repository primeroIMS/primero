import { expect } from "chai";
import { Map } from "immutable";

import actions from "../actions";

import * as helper from "./helpers";

describe("<Transition /> - helper", () => {

  it("should have known methods", () => {
    const cloneActions = { ...helper };

    [
      "internalFieldsDirty",
      "getInternalFields",
      "hasProvidedConsent",
      "generatePath"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("function");
      delete cloneActions[property];
    });
    expect(cloneActions).to.be.empty;
  });

  describe("with internalFieldsDirty", () => {
    const fields = ["agency"];
    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };
      expect(helper.internalFieldsDirty(values, fields)).to.be.equal(true);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };
      expect(helper.internalFieldsDirty(values, fields)).to.be.equal(false);
    });
  });

  describe("with getInternalFields", () => {
    const fields = ["agency"];
    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };
      expect(helper.getInternalFields(values, fields)).to.deep.equal(values);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };
      expect(helper.getInternalFields(values, fields)).to.be.empty;
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
        expect(helper.hasProvidedConsent(record)).to.equal(true);
      });
    });
    describe("when record has not provided consent", () => {
      const record = Map({
        id: "123",
        module_id: "primeromodule-cp"
      });
      it("should return false", () => {
        expect(helper.hasProvidedConsent(record)).to.be.undefined;
      });
    });
  });

  describe("with generatePath", () => {
    const recordId = "123";
    describe("when path is assigns", () => {
      const expected = "cases/123/assigns";
      it("should return correct path 'cases/123/assigns'", () => {
        expect(
          helper.generatePath(actions.CASES_ASSIGNS, recordId)
        ).to.deep.equal(expected);
      });
    });
    describe("when path is transfers", () => {
      const expected = "cases/123/transfers";
      it("should return correct path 'cases/123/transfers'", () => {
        expect(
          helper.generatePath(actions.CASES_TRANSFERS, recordId)
        ).to.deep.equal(expected);
      });
    });
    describe("when path is referral", () => {
      const expected = "cases/123/referrals";
      it("should return correct path 'cases/123/referrals'", () => {
        expect(
          helper.generatePath(actions.CASES_REFERRALS, recordId)
        ).to.deep.equal(expected);
      });
    });
  });
});
