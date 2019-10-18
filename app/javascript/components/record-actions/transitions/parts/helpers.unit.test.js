import { expect } from "chai";
import "test/test.setup";
import { getInternalFields, internalFieldsDirty, hasProvidedConsent } from "./helpers";
import { Map } from "immutable";

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
});
