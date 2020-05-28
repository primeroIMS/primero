import { stub } from "../../../test";

import * as handleOptions from "./handle-options";

describe("form/utils/handle-options", () => {
  describe("generateIdForNewOption()", () => {
    it("returns an id", () => {
      stub(Date, "now").returns(12345);

      expect(handleOptions.generateIdForNewOption()).to.equal(
        "new_option_12345"
      );
    });

    afterEach(() => {
      if (Date.now.restore) {
        Date.now.restore();
      }
    });
  });

  describe("generateIdFromDisplayText()", () => {
    it("returns an id for the diplay_text", () => {
      expect(
        handleOptions.generateIdFromDisplayText("Display Text 1")
      ).to.equal("display_text_1");
    });
  });

  describe("mergeOptions()", () => {
    it("should merge the options", () => {
      const options1 = [
        { id: "option_1", display_text: "Option 1" },
        { id: "option_2", display_text: "Option 2" }
      ];
      const options2 = [
        { id: "option_1", display_text: "Option Display Text 1" }
      ];
      const expected = [
        { id: "option_1", display_text: "Option Display Text 1" },
        { id: "option_2", display_text: "Option 2" }
      ];

      expect(handleOptions.mergeOptions(options1, options2)).to.deep.equal(
        expected
      );
    });
  });
});
