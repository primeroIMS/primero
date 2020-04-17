import * as utils from "./utils";

describe("<LookupsForm> - utils", () => {
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
});
