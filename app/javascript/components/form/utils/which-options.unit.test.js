// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { optionText } from "./which-options";

describe("<Form /> - Options", () => {
  describe("optionText()", () => {
    const locale = "en";

    it("returns display text if object", () => {
      expect(optionText({ display_text: { en: "Option 1" } }, locale)).toBe("Option 1");
    });

    it("returns display name if object", () => {
      expect(optionText({ display_name: { en: "Option 1" } }, locale)).toBe("Option 1");
    });

    it("returns display name if string", () => {
      expect(optionText({ display_text: "Option 1" }, locale)).toBe("Option 1");
    });

    it("returns display text if string", () => {
      expect(optionText({ display_name: "Option 1" }, locale)).toBe("Option 1");
    });
  });
});
