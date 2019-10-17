import { expect } from "chai";
import "test/test.setup";
import { getInternalFields, internalFieldsDirty } from "./helpers";

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
});
