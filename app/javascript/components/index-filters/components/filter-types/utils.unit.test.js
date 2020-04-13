import { spy } from "../../../../test";
import { AGE_MAX } from "../../../../config";

import {
  ageParser,
  optionText,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "./utils";

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

  describe("whichOptions()", () => {
    it("returns i18n options", () => {});

    it("returns array of options", () => {
      const expected = [{ id: "option-1", display_name: "Option 1" }];
      const output = whichOptions({ options: expected });

      expect(output).to.deep.equal(expected);
    });

    it("returns lookups", () => {
      const expected = [{ id: "option-1", display_name: "Option 1" }];
      const output = whichOptions({
        optionStringsSource: "looksup",
        lookups: expected
      });

      expect(output).to.deep.equal(expected);
    });
  });

  describe("handleMoreFiltersChange()", () => {
    const moreFilters = {};
    const fieldName = "filter1";

    it("handles basic input from array values", () => {
      const setMoreFilters = spy();

      handleMoreFiltersChange(moreFilters, setMoreFilters, fieldName, [
        "option-1"
      ]);

      expect(setMoreFilters.getCalls()?.length).to.be.equal(1);
      expect(setMoreFilters).to.have.been.calledWith({ filter1: ["option-1"] });
    });

    it("handles basic input from boolean value", () => {
      const setMoreFilters = spy();

      handleMoreFiltersChange(moreFilters, setMoreFilters, fieldName, true);

      expect(setMoreFilters.getCalls()?.length).to.be.equal(1);
      expect(setMoreFilters).to.have.been.calledWith({ filter1: true });
    });
  });

  describe("resetSecondaryFilter()", () => {
    const moreSectionFilters = { flagged: true };
    const fieldName = "flagged";

    it("should call setMoreSectionFilters if secondary is true", () => {
      const setMoreSectionFilters = spy();

      resetSecondaryFilter(
        true,
        fieldName,
        [],
        moreSectionFilters,
        setMoreSectionFilters
      );

      expect(setMoreSectionFilters.getCalls().length).to.be.equal(1);
      expect(setMoreSectionFilters).to.have.been.calledWith({});
    });

    it("should not call setMoreSectionFilters if secondary is false", () => {
      const setMoreSectionFilters = spy();

      resetSecondaryFilter(
        false,
        fieldName,
        [],
        moreSectionFilters,
        setMoreSectionFilters
      );

      expect(setMoreSectionFilters).to.have.not.been.called;
    });
  });

  describe("setMoreFilterOnPrimarySection()", () => {
    const filters = { flagged: true };
    const fieldName = "flagged";

    it("should call setValues if fieldName is included on filters", () => {
      const setValues = spy();

      setMoreFilterOnPrimarySection(filters, fieldName, setValues);

      expect(setValues.getCalls().length).to.be.equal(1);
      expect(setValues).to.have.been.calledWith(fieldName, true);
    });

    it("should not call setValues if fieldName isn't included on filters", () => {
      const setValues = spy();

      setMoreFilterOnPrimarySection({}, fieldName, setValues);

      expect(setValues).to.have.not.been.called;
    });
  });
});
