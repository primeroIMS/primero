// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import uuid from "../../../../libs/uuid";

import * as utils from "./utils";

describe("<LookupsForm> - utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["buildValues", "getDisabledInfo", "getInitialNames", "getInitialValues", "reorderValues", "validations"].forEach(
        property => {
          expect(clone).toHaveProperty(property);
          expect(clone[property]).toBeInstanceOf(Function);
          delete clone[property];
        }
      );
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("validations", () => {
    it("should return an array of fields that has validations", () => {
      const i18n = { t: () => {} };
      const expected = ["name"];

      expect(Object.keys(utils.validations(i18n).fields)).toEqual(expected);
    });
  });

  describe("getInitialNames", () => {
    const locales = ["en"];

    it("should return an object of names that are include on locales", () => {
      const name = {
        en: "Case Status",
        fr: " État de case",
        es: "Estado de los casos"
      };

      const expected = { en: "Case Status" };

      expect(utils.getInitialNames(locales, name)).toEqual(expected);
    });

    it("should return an empty object if any name is passed", () => {
      const name = {};

      expect(utils.getInitialNames(locales, name)).toEqual({});
    });
  });

  describe("getInitialValues", () => {
    const locales = ["en", "es"];

    it("should return an object of values that are include on locales", () => {
      const values = [
        {
          id: "open",
          display_text: {
            en: "Open",
            es: "Abierto",
            fr: ""
          }
        },
        {
          id: "closed",
          display_text: {
            en: "Closed",
            es: "Cerrado",
            fr: ""
          }
        }
      ];

      const expected = {
        en: { open: "Open", closed: "Closed" },
        es: { open: "Abierto", closed: "Cerrado" }
      };

      expect(utils.getInitialValues(locales, values)).toEqual(expected);
    });

    it("should return an empty object if any values is passed", () => {
      const values = {};

      expect(utils.getInitialValues(locales, values)).toEqual({});
    });
  });

  describe("getDisabledInfo", () => {
    it("should return values for a lookup", () => {
      const values = fromJS([
        {
          id: "test1",
          disabled: false,
          display_text: { en: "Test 1" }
        },
        {
          id: "test2",
          disabled: true,
          display_text: { en: "Test 2" }
        }
      ]);

      const expected = {
        test1: true,
        test2: false
      };

      expect(utils.getDisabledInfo(values)).toEqual(expected);
    });
  });

  describe("reorderValues", () => {
    it("should return a sorted array of values depending startIndex and endIndex", () => {
      const items = ["open", "closed", "transferred", "duplicate"];
      const expected = ["transferred", "open", "closed", "duplicate"];

      expect(utils.reorderValues(items, 2, 0)).toEqual(expected);
    });
  });

  describe("buildValues", () => {
    beforeEach(() => {
      jest.spyOn(uuid, "v4").mockReturnValue("1234abc");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return values for a lookup", () => {
      const values = {
        en: { test: "Test", new_option_1: "Test 1" },
        es: { test: "Prueba", new_option_1: "Prueba 1" }
      };

      const disabled = {
        test: true,
        test_1: false
      };

      const expected = [
        {
          id: "test",
          disabled: false,
          display_text: {
            en: "Test",
            es: "Prueba"
          }
        },
        {
          id: "test_1_1234abc",
          disabled: true,
          display_text: {
            en: "Test 1",
            es: "Prueba 1"
          }
        }
      ];

      expect(utils.buildValues(values, "en", disabled, null)).toEqual(expected);
    });
    it("DEPRECATED should return values with _delete key if there are removed values", () => {
      const values = {
        en: { test: "Test" },
        es: { test: "Prueba" }
      };

      const removed = ["test_1"];

      const expected = [
        {
          id: "test",
          display_text: {
            en: "Test",
            es: "Prueba"
          }
        },
        {
          id: "test_1",
          display_text: {},
          _delete: true
        }
      ];

      expect(utils.buildValues(values, "en", removed, [])).not.toBe(expected);
    });
    it("should return values for a lookup with ordered item", () => {
      const values = {
        en: { test: "Test", new_option_1: "Test 1" },
        es: { test: "Prueba", new_option_1: "Prueba 1" }
      };

      const disabled = {
        test: true,
        test_1: false
      };

      const expected = [
        {
          id: "test_1_1234abc",
          disabled: true,
          display_text: {
            en: "Test 1",
            es: "Prueba 1"
          }
        },
        {
          id: "test",
          disabled: false,
          display_text: {
            en: "Test",
            es: "Prueba"
          }
        }
      ];

      expect(utils.buildValues(values, "en", disabled, ["new_option_1", "test"])).toEqual(expected);
    });
  });
});
