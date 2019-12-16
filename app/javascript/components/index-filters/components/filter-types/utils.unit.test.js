import { fromJS } from "immutable";

import { expect } from "../../../../test";
import { AGE_MAX } from "../../../../config";

import { ageParser, optionText } from "./utils";

const i18n = { locale: "en" };

describe("<IndexFitlers>/components/filter-types/utils", () => {
  describe("ageParser()", () => {
    it("returns age range with param value with a dash", () => {
      expect(ageParser("1 - 5")).to.equal("1..5");
    });

    it("returns age range with param value with a dash", () => {
      expect(ageParser("18+")).to.equal(`18..${AGE_MAX}`);
    });
  });

  describe("optionText()", () => {
    it("returns display_text from option object", () => {
      const option = { display_text: "Option 1" };

      expect(optionText(option)).to.equal(option.display_text);
    });

    it("returns display_name from option object", () => {
      const option = { display_name: "Option 1" };

      expect(optionText(option)).to.equal(option.display_name);
    });

    it("returns display_name locale object from option object", () => {
      const option = { display_text: { en: "Option 1 (en)" } };

      expect(optionText(option, i18n)).to.equal(option.display_text.en);
    });

    it("returns display_name locale object from option object", () => {
      const option = { display_name: { en: "Option 1 (en)" } };

      expect(optionText(option, i18n)).to.equal(option.display_name.en);
    });
  });

  describe('whichOptions()', () => {
    it('returns correct ')
  });
});
