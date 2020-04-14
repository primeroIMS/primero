import { Map } from "immutable";

import {
  touchedFormData,
  whichFormMode,
  whichOptions,
  optionText
} from "./utils";
import { FORM_MODE_NEW } from "./constants";

describe("<Form /> - Utils", () => {
  describe("buildFormModeObject()", () => {
    it("should build form state object", () => {
      const formMode = whichFormMode(FORM_MODE_NEW);

      const expected = Map({
        isShow: false,
        isNew: true,
        isEdit: false,
        isDialog: false
      });

      expect(formMode).to.deep.equal(expected);
    });
  });

  describe("touchedFormData()", () => {
    it("returns touched data", () => {
      const data = {
        prop1: true,
        prop2: ["open"],
        prop3: "test",
        prop4: [{ prop4a: "prop-4a", prop4b: "prop-4b" }]
      };

      const expected = {
        prop1: true,
        prop2: ["open"],
        prop4: [{ prop4a: "prop-4a" }]
      };

      const touched = {
        prop1: true,
        prop2: true,
        prop4: [{ prop4a: true }]
      };

      expect(touchedFormData(touched, data)).to.deep.equal(expected);
    });
  });

  describe("whichOptions()", () => {
    const options = [{ id: "option-1", display_text: "Option 1" }];

    it("returns lookups if optionStringsSource set", () => {
      expect(
        whichOptions({
          optionStringsSource: "test",
          lookups: options
        })
      ).to.deep.equal(options);
    });

    it("returns array of options if options is an array", () => {
      expect(
        whichOptions({
          options
        })
      ).to.deep.equal(options);
    });

    it("returns array of options if options is an object", () => {
      expect(
        whichOptions({
          options: {
            en: options
          },
          i18n: {
            locale: "en"
          }
        })
      ).to.deep.equal(options);
    });
  });

  describe("optionText()", () => {
    const i18n = { locale: "en" };

    it("returns display text if object", () => {
      expect(optionText({ display_text: { en: "Option 1" } }, i18n)).to.equal(
        "Option 1"
      );
    });

    it("returns display name if object", () => {
      expect(optionText({ display_name: { en: "Option 1" } }, i18n)).to.equal(
        "Option 1"
      );
    });

    it("returns display name if string", () => {
      expect(optionText({ display_text: "Option 1" }, i18n)).to.equal(
        "Option 1"
      );
    });

    it("returns display text if string", () => {
      expect(optionText({ display_name: "Option 1" }, i18n)).to.equal(
        "Option 1"
      );
    });
  });
});
