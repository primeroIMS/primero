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
      const options = fromJS([{ id: value, display_text: label }]);

      expect(utils.getValueLabel({ options, value })).to.equal(label);
    });

    it("should return the value if does not exist", () => {
      const value = "opt-1";
      const options = fromJS([{ id: "opt-2", display_text: "Option 2" }]);

      expect(utils.getValueLabel({ options, value })).to.equal(value);
    });

    it("should return a comma separated string if the value is an array", () => {
      const expected = "Option 1, Option 2";
      const value = ["opt-1", "opt-2"];
      const options = fromJS([
        { id: "opt-1", display_text: "Option 1" },
        { id: "opt-2", display_text: "Option 2" }
      ]);

      expect(utils.getValueLabel({ options, value })).to.equal(expected);
    });

    it("should return a comma separated string if the value is a list", () => {
      const expected = "Option 1, Option 2";
      const value = fromJS(["opt-1", "opt-2"]);
      const options = fromJS([
        { id: "opt-1", display_text: "Option 1" },
        { id: "opt-2", display_text: "Option 2" }
      ]);

      expect(utils.getValueLabel({ options, value })).to.equal(expected);
    });
  });
});
