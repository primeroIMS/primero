import { fromJS } from "immutable";

import { TEXT_FIELD, TEXT_AREA, DATE_FIELD } from "../../../../../../form";

import * as utils from "./utils";

describe("<RecordForm>/form/subforms/<SubformTraces>/components/<FieldRow> - utils", () => {
  describe("isTextField", () => {
    it("should return true if the field is a text field", () => {
      const field = { name: "field_1", type: TEXT_FIELD };

      expect(utils.isTextField(field)).to.be.true;
    });

    it("should return true if the field is a text area", () => {
      const field = { name: "field_1", type: TEXT_AREA };

      expect(utils.isTextField(field)).to.be.true;
    });

    it("should return false if the field is not a text field", () => {
      const field = { name: "field_1", type: DATE_FIELD };

      expect(utils.isTextField(field)).to.be.false;
    });
  });

  describe("getValueLabel", () => {
    it("should return the label for a given value", () => {
      const value = "opt-1";
      const label = "Option 1";
      const options = fromJS({ values: [{ id: value, display_text: { en: label } }] });

      expect(utils.getValueLabel({ options, i18n: { locale: "en" }, value })).to.equal(label);
    });

    it("should return the value if does not exist", () => {
      const value = "opt-1";
      const options = fromJS({ values: [{ id: "opt-2", display_text: { en: "Option 2" } }] });

      expect(utils.getValueLabel({ options, i18n: { locale: "en" }, value })).to.equal(value);
    });
  });
});
