// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DefaultButton, IconButton } from "./components";
import * as helper from "./utils";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<AuditLogs /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["buttonType"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("buttonType", () => {
    it("should return <DefaultButton /> Component if ACTION_BUTTON_TYPES is default", () => {
      expect(helper.buttonType(ACTION_BUTTON_TYPES.default)).toBe(DefaultButton);
    });

    it("should return <IconButton /> Component if ACTION_BUTTON_TYPES is icon", () => {
      expect(helper.buttonType(ACTION_BUTTON_TYPES.icon)).toBe(IconButton);
    });

    it("should return null if any invalid type is passed in", () => {
      expect(helper.buttonType("test")).toBeNull();
    });
  });
});
