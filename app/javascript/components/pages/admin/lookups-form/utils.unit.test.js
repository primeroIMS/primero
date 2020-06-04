import * as utils from "./utils";

describe("<LookupsForm> - utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      [
        "buildValues",
        "getInitialNames",
        "getInitialValues",
        "reorderValues",
        "validations"
      ].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("validations", () => {
    it("should return an array of fields that has validations", () => {
      const i18n = { t: () => {} };
      const expected = ["name"];

      expect(Object.keys(utils.validations(i18n).fields)).to.deep.equal(
        expected
      );
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

      expect(utils.getInitialNames(locales, name)).to.deep.equal(expected);
    });

    it("should return an empty object if any name is passed", () => {
      const name = {};

      expect(utils.getInitialNames(locales, name)).to.be.empty;
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

      expect(utils.getInitialValues(locales, values)).to.deep.equal(expected);
    });

    it("should return an empty object if any values is passed", () => {
      const values = {};

      expect(utils.getInitialValues(locales, values)).to.be.empty;
    });
  });

  describe("reorderValues", () => {
    it("should return a sorted array of values depending startIndex and endIndex", () => {
      const items = ["open", "closed", "transferred", "duplicate"];
      const expected = ["transferred", "open", "closed", "duplicate"];

      expect(utils.reorderValues(items, 2, 0)).to.deep.equal(expected);
    });
  });

  describe("buildValues", () => {
    it("should return values for a lookup", () => {
      const values = {
        en: { test: "Test", test_1: "Test 1" },
        es: { test: "Prueba", test_1: "Prueba 1" }
      };

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
          display_text: {
            en: "Test 1",
            es: "Prueba 1"
          }
        }
      ];

      expect(utils.buildValues(values, "en", [])).to.deep.equal(expected);
    });
    it("should return values with _delete key if there are removed values", () => {
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

      expect(utils.buildValues(values, "en", removed)).to.deep.equal(expected);
    });
  });
});
