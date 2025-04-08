// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";
import { ORIENTATION } from "./constants";

describe("I8n - utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["getLocaleDir"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("getLocaleDir", () => {
    it("should return rtl when recieve any locale RTL orientation locale", () => {
      expect(utils.getLocaleDir("ar")).toBe(ORIENTATION.rtl);
      expect(utils.getLocaleDir("ar-LB")).toBe(ORIENTATION.rtl);
      expect(utils.getLocaleDir("ar-SD")).toBe(ORIENTATION.rtl);
      expect(utils.getLocaleDir("ku")).toBe(ORIENTATION.rtl);
      expect(utils.getLocaleDir("zh")).toBe(ORIENTATION.rtl);
    });

    it("hould return rtl when recieve any locale LTR orientation locale", () => {
      expect(utils.getLocaleDir("en")).toBe(ORIENTATION.ltr);
      expect(utils.getLocaleDir("as")).toBe(ORIENTATION.ltr);
    });
  });
});
