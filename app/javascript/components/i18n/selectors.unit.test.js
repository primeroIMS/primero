import { fromJS } from "immutable";

import { getLocale, getLocales, getAppDirection } from "./selectors";

const stateWithoutRecords = fromJS({});
const state = fromJS({
  application: {
    defaultLocale: "en",
    primero: {
      locales: ["en", "ar-LB"]
    }
  },
  ui: {
    I18n: {
      locale: "ar-LB",
      dir: "rtl"
    }
  }
});

describe("I18n - Selectors", () => {
  describe("getLocale", () => {
    it("should return default locale from ui", () => {
      const expected = "ar-LB";

      const records = getLocale(state);

      expect(records).to.deep.equals(expected);
    });

    it("should return default locale from window.I18n.locale", () => {
      const expected = "en";
      const records = getLocale(stateWithoutRecords);

      expect(records).to.be.equals(expected);
    });
  });

  describe("getLocales", () => {
    it("should return locales from state", () => {
      const expected = fromJS(["en", "ar-LB"]);

      const records = getLocales(state);

      expect(records).to.deep.equals(expected);
    });

    it("should return empty array", () => {
      const records = getLocales(stateWithoutRecords);

      expect(records).to.be.empty;
    });
  });

  describe("getAppDirection", () => {
    it("should return dir from state", () => {
      const expected = "rtl";

      const records = getAppDirection(state);

      expect(records).to.be.equals(expected);
    });

    it("should return default dir (ltr)", () => {
      const expected = "ltr";
      const records = getAppDirection(stateWithoutRecords);

      expect(records).to.be.equals(expected);
    });
  });
});
