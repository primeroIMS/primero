// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as handleOptions from "./handle-options";

describe("form/utils/handle-options", () => {
  describe("generateIdForNewOption()", () => {
    it("returns an id", () => {
      jest.spyOn(Date, "now").mockReturnValue(12345);

      expect(handleOptions.generateIdForNewOption()).toBe("new_option_12345");
    });

    afterEach(() => {
      jest.spyOn(Date, "now").mockRestore();
    });
  });

  describe("generateIdFromDisplayText()", () => {
    it("returns an id for the diplay_text", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.522234);
      expect(handleOptions.generateIdFromDisplayText("Display Text 1")).toBe("display_text_1_522234");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe("mergeOptions()", () => {
    it("should merge the options", () => {
      const options1 = [
        { id: "option_1", display_text: "Option 1" },
        { id: "option_2", display_text: "Option 2" }
      ];
      const options2 = [{ id: "option_1", display_text: "Option Display Text 1" }];
      const expected = [
        { id: "option_1", display_text: "Option Display Text 1" },
        { id: "option_2", display_text: "Option 2" }
      ];

      expect(handleOptions.mergeOptions(options1, options2)).toEqual(expected);
    });
  });
});
