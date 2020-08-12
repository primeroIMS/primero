import { DefaultButton, IconButton } from "./components";
import * as helper from "./utils";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<AuditLogs /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["buttonType"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("buttonType", () => {
    it("should return <DefaultButton /> Component if ACTION_BUTTON_TYPES is default", () => {
      expect(helper.buttonType(ACTION_BUTTON_TYPES.default)).to.equal(DefaultButton);
    });

    it("should return <IconButton /> Component if ACTION_BUTTON_TYPES is icon", () => {
      expect(helper.buttonType(ACTION_BUTTON_TYPES.icon)).to.equal(IconButton);
    });

    it("should return null if any invalid type is passed in", () => {
      expect(helper.buttonType("test")).to.be.null;
    });
  });
});
