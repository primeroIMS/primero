// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map } from "immutable";

import actions from "../actions";

import * as utils from "./utils";

describe("<Transition /> - utils", () => {
  it("should have known methods", () => {
    const cloneActions = { ...utils };

    [
      "generatePath",
      "getInternalFields",
      "getUserFilters",
      "hasProvidedConsent",
      "internalFieldsDirty",
      "buildDataAssign",
      "searchableValue"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(cloneActions[property]).toBeInstanceOf(Function);
      delete cloneActions[property];
    });
    expect(Object.keys(cloneActions)).toHaveLength(0);
  });

  describe("with internalFieldsDirty", () => {
    const fields = ["agency"];

    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };

      expect(utils.internalFieldsDirty(values, fields)).toBe(true);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };

      expect(utils.internalFieldsDirty(values, fields)).toBe(false);
    });
  });

  describe("with getInternalFields", () => {
    const fields = ["agency"];

    it("should return true if there are dirty fields", () => {
      const values = { agency: "UNICEF" };

      expect(utils.getInternalFields(values, fields)).toEqual(values);
    });

    it("should return false if there aren't dirty fields", () => {
      const values = { agency: "" };

      expect(utils.getInternalFields(values, fields)).toStrictEqual({});
    });
  });

  describe("with hasProvidedConsent", () => {
    describe("when record has provided consent", () => {
      const record = Map({
        id: "123",
        module_id: "primeromodule-cp",
        consent_for_services: true,
        disclosure_other_orgs: true
      });

      it("should return true", () => {
        expect(utils.hasProvidedConsent(record)).toBe(true);
      });
    });
    describe("when record has not provided consent", () => {
      const record = Map({
        id: "123",
        module_id: "primeromodule-cp"
      });

      it("should return false", () => {
        expect(utils.hasProvidedConsent(record)).toBe(false);
      });
    });
  });

  describe("with generatePath", () => {
    const recordId = "123";

    describe("when path is assigns", () => {
      const expected = "cases/123/assigns";

      it("should return correct path 'cases/123/assigns'", () => {
        expect(utils.generatePath(actions.CASES_ASSIGNS, recordId)).toEqual(expected);
      });
    });
    describe("when path is transfers", () => {
      const expected = "cases/123/transfers";

      it("should return correct path 'cases/123/transfers'", () => {
        expect(utils.generatePath(actions.CASES_TRANSFERS, recordId)).toEqual(expected);
      });
    });
    describe("when path is referral", () => {
      const expected = "cases/123/referrals";

      it("should return correct path 'cases/123/referrals'", () => {
        expect(utils.generatePath(actions.CASES_REFERRALS, recordId)).toEqual(expected);
      });
    });
    describe("when path is bulk assigns", () => {
      const expected = "cases/assigns";
      const recordsIds = [12345, 67890];

      it("should return correct path 'cases/assigns'", () => {
        expect(utils.generatePath(actions.CASES_ASSIGNS, recordId, recordsIds)).toEqual(expected);
      });
    });
  });

  describe("getUserFilters", () => {
    it("returns all filters if all have values", () => {
      const filters = {
        services: "test",
        agency: "agency1",
        location: "1234a"
      };
      const expected = { ...filters };

      expect(utils.getUserFilters(filters)).toEqual(expected);
    });

    it("returns the filters with values", () => {
      const filters = { services: "test", agency: "", location: "1234a" };
      const expected = { services: "test", location: "1234a" };

      expect(utils.getUserFilters(filters)).toEqual(expected);
    });
  });

  describe("searchableValue", () => {
    const field = {
      value: "test_2"
    };

    const options = [
      {
        value: "test_1",
        label: "test_1"
      },
      {
        value: "test_2",
        label: "test_2"
      }
    ];

    it("returns selected value from options", () => {
      const expected = {
        value: "test_2",
        label: "test_2"
      };

      expect(utils.searchableValue(field, options, false)).toEqual(expected);
    });

    it("returns default value from options if disableControl is true", () => {
      expect(utils.searchableValue(field, options, true)).toBeNull();
    });

    it("returns default value from options if any values is selected", () => {
      expect(utils.searchableValue({ ...field, value: "" }, options, false)).toBeNull();
    });
  });
});
