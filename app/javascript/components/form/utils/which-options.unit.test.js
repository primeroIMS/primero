import { whichOptions, optionText } from "./which-options";

describe("<Form /> - Options", () => {
  describe("whichOptions()", () => {
    const options = [{ id: "option-1", display_text: "Option 1" }];

    it("returns lookups if optionStringsSource set", () => {
      expect(
        whichOptions({
          optionStringsSource: "test",
          lookups: options,
          i18n: {
            locale: "en"
          }
        })
      ).to.deep.equal(options);
    });

    it("returns array of options if options is an array", () => {
      expect(
        whichOptions({
          options
        })
      ).to.deep.equal(options);
    });

    it("returns array of options if options is an object", () => {
      expect(
        whichOptions({
          options: {
            en: options
          },
          i18n: {
            locale: "en"
          }
        })
      ).to.deep.equal(options);
    });
  });

  describe("optionText()", () => {
    const locale = "en";

    it("returns display text if object", () => {
      expect(optionText({ display_text: { en: "Option 1" } }, locale)).to.equal(
        "Option 1"
      );
    });

    it("returns display name if object", () => {
      expect(optionText({ display_name: { en: "Option 1" } }, locale)).to.equal(
        "Option 1"
      );
    });

    it("returns display name if string", () => {
      expect(optionText({ display_text: "Option 1" }, locale)).to.equal(
        "Option 1"
      );
    });

    it("returns display text if string", () => {
      expect(optionText({ display_name: "Option 1" }, locale)).to.equal(
        "Option 1"
      );
    });
  });
});