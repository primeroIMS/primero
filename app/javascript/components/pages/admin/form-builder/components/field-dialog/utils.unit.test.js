import { fromJS } from "immutable";

import { SEPARATOR, TEXT_FIELD, TICK_FIELD } from "../../../../../form";

import * as utils from "./utils";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - index", () => {
  describe("getFormField", () => {
    const i18n = { t: value => value };

    it("should return the form sections for TEXT_FIELD type", () => {
      const formSections = utils.getFormField(
        fromJS({
          type: TEXT_FIELD,
          name: "owned_by"
        }),
        i18n
      );

      expect(formSections.forms.size).to.be.equal(2);
    });

    it("should return the form sections for TICK_FIELD type", () => {
      const formSections = utils.getFormField(
        fromJS({
          type: TICK_FIELD,
          name: "test"
        }),
        i18n
      );

      expect(formSections.forms.size).to.be.equal(2);
    });
  });

  describe("toggleHideOnViewPage", () => {
    it("should toggle the value of hide_on_view_page property", () => {
      const field1 = { name: "field_1", visible: true };
      const expected = {
        field_1: {
          ...field1,
          hide_on_view_page: false
        }
      };

      expect(
        utils.toggleHideOnViewPage("field_1", {
          ...field1,
          hide_on_view_page: true
        })
      ).to.deep.equal(expected);
    });

    it("should return the form sections for SEPARATOR type", () => {
      const i18n = { t: value => value };
      const formSections = utils.getFormField(
        fromJS({
          type: SEPARATOR,
          name: "test"
        }),
        i18n
      );

      expect(formSections.forms.size).to.be.equal(2);
    });
  });
});

describe("addWithIndex", () => {
  it("should add an element on an specific index array", () => {
    const original = ["a", "b", "c"];
    const expected = ["a", "b", "d", "c"];

    expect(utils.addWithIndex(original, 2, "d")).to.deep.equals(expected);
  });
});
