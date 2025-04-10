// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      expect(ageParser("1 - 5")).toBe("1..5");
    });

    it("returns age range with param value with a dash", () => {
      expect(ageParser("18+")).toBe(`18..${AGE_MAX}`);
    });
  });

  describe("optionText()", () => {
    it("returns display_text from option object", () => {
      const option = { display_text: "Option 1" };

      expect(optionText(option)).toBe(option.display_text);
    });

    it("returns display_name from option object", () => {
      const option = { display_name: "Option 1" };

      expect(optionText(option)).toBe(option.display_name);
    });

    it("returns display_name locale object from option object", () => {
      const option = { display_text: { en: "Option 1 (en)" } };

      expect(optionText(option, i18n)).toBe(option.display_text.en);
    });

    it("returns display_name locale object from option object", () => {
      const option = { display_name: { en: "Option 1 (en)" } };

      expect(optionText(option, i18n)).toBe(option.display_name.en);
    });
  });

  describe("whichOptions()", () => {
    it("returns i18n options", () => {});

    it("returns array of options", () => {
      const expected = [{ id: "option-1", display_name: "Option 1" }];
      const output = whichOptions({ options: expected });

      expect(output).toEqual(expected);
    });

    it("returns lookups", () => {
      const expected = [{ id: "option-1", display_name: "Option 1" }];
      const output = whichOptions({
        optionStringsSource: "looksup",
        lookups: expected
      });

      expect(output).toEqual(expected);
    });
  });

  describe("handleMoreFiltersChange()", () => {
    const moreFilters = {};
    const fieldName = "filter1";

    it("handles basic input from array values", () => {
      const setMoreFilters = jest.fn();

      handleMoreFiltersChange(moreFilters, setMoreFilters, fieldName, ["option-1"]);

      expect(setMoreFilters).toHaveBeenCalledTimes(1);
      expect(setMoreFilters).toHaveBeenCalledWith({ filter1: ["option-1"] });
    });

    it("handles basic input from boolean value", () => {
      const setMoreFilters = jest.fn();

      handleMoreFiltersChange(moreFilters, setMoreFilters, fieldName, true);

      expect(setMoreFilters).toHaveBeenCalledTimes(1);
      expect(setMoreFilters).toHaveBeenCalledWith({ filter1: true });
    });
  });

  describe("resetSecondaryFilter()", () => {
    const moreSectionFilters = { flagged: true };
    const fieldName = "flagged";

    it("should call setMoreSectionFilters if secondary is true", () => {
      const setMoreSectionFilters = jest.fn();

      resetSecondaryFilter(true, fieldName, [], moreSectionFilters, setMoreSectionFilters);

      expect(setMoreSectionFilters).toHaveBeenCalledTimes(1);
      expect(setMoreSectionFilters).toHaveBeenCalledWith({});
    });

    it("should not call setMoreSectionFilters if secondary is false", () => {
      const setMoreSectionFilters = jest.fn();

      resetSecondaryFilter(false, fieldName, [], moreSectionFilters, setMoreSectionFilters);

      expect(setMoreSectionFilters).not.toHaveBeenCalled();
    });
  });

  describe("setMoreFilterOnPrimarySection()", () => {
    const filters = { flagged: true };
    const fieldName = "flagged";

    it("should call setValues if fieldName is included on filters", () => {
      const setValues = jest.fn();

      setMoreFilterOnPrimarySection(filters, fieldName, setValues);

      expect(setValues).toHaveBeenCalledTimes(1);
      expect(setValues).toHaveBeenCalledWith(fieldName, true);
    });

    it("should not call setValues if fieldName isn't included on filters", () => {
      const setValues = jest.fn();

      setMoreFilterOnPrimarySection({}, fieldName, setValues);

      expect(setValues).not.toHaveBeenCalled();
    });
  });
});
