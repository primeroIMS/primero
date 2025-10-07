// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isDisabledAction, subformExists } from "./utils";
import { ENABLED_FOR_ONE, ENABLED_FOR_ONE_MANY_ALL } from "./constants";

describe("<RecordActions /> - utils", () => {
  const totaRecords = 10;
  const enabledOnSearch = false;
  const isSearchFromList = false;

  describe("isDisabledAction", () => {
    it("should return true when the actions is not enabled", () => {
      const selectedRecords = { 0: [1, 5, 9] };

      expect(isDisabledAction(ENABLED_FOR_ONE, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords)).toBe(
        true
      );
    });

    it("should return false when the actions is enabled", () => {
      const selectedRecords = { 0: [4] };

      expect(isDisabledAction(ENABLED_FOR_ONE, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords)).toBe(
        false
      );
    });

    it("should return false when the isSearchFromList and enabledOnSearch are true", () => {
      const selectedRecords = { 0: [4] };

      expect(isDisabledAction(ENABLED_FOR_ONE, !enabledOnSearch, !isSearchFromList, selectedRecords, totaRecords)).toBe(
        false
      );
    });

    it("should return true when the selectedRecords is empty and there are not records", () => {
      const selectedRecords = {};

      expect(isDisabledAction(ENABLED_FOR_ONE_MANY_ALL, enabledOnSearch, isSearchFromList, selectedRecords, 0)).toBe(
        true
      );
    });
  });

  describe("subformExists", () => {
    it("should return null if parent form is not defined", () => {
      expect(subformExists(null, "test_name")).toBeNull();
    });

    it("should return undefined if parent form does not have fields", () => {
      const parentForm = {
        id: 1,
        unique_id: "test_parent_form",
        fields: []
      };

      expect(subformExists(parentForm, "test_name")).toBeUndefined();
    });

    it("should return subform_section_id from the parent", () => {
      const expected = {
        id: 1,
        name: "test_name"
      };
      const parentForm = {
        id: 1,
        unique_id: "test_parent_form",
        fields: [expected]
      };

      expect(subformExists(parentForm, "test_name")).toEqual();
    });
  });
});
