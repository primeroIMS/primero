import * as utils from "./utils";

describe("index-filters/components/filter-types/select-filter/utils.js", () => {
  describe("with exposed properties", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["getOptionName"].forEach(property => {
      it(`exports ${property}`, () => {
        expect(clone).to.have.property(property);
        delete clone[property];
      });
    });
  });

  describe("getOptionName()", () => {
    const i18n = { locale: "en" };
    const namesProps = ["display_name", "display_text", "or name"].join(", ");

    it(`should returns an empty string if the option doesn't have any ${namesProps} prop`, () => {
      const option = { test: 1 };

      expect(utils.getOptionName(option, i18n)).to.be.empty;
    });

    it(`should return the translated value if any ${namesProps} is included in the option`, () => {
      const optionDisplayName = { display_name: "Test display name" };
      const optionDisplayText = { display_text: "Test display text" };
      const optionName = { name: "Test name" };

      expect(utils.getOptionName(optionDisplayName, i18n)).to.be.equal("Test display name");
      expect(utils.getOptionName(optionDisplayText, i18n)).to.be.equal("Test display text");
      expect(utils.getOptionName(optionName, i18n)).to.be.equal("Test name");
    });

    it(`should return the translated value if any ${namesProps} is included in the option with the translation`, () => {
      const optionDisplayName = { display_name: { en: "Test display name" } };
      const optionDisplayText = { display_text: { en: "Test display text" } };
      const optionName = { name: { en: "Test name" } };

      expect(utils.getOptionName(optionDisplayName, i18n)).to.be.equal("Test display name");
      expect(utils.getOptionName(optionDisplayText, i18n)).to.be.equal("Test display text");
      expect(utils.getOptionName(optionName, i18n)).to.be.equal("Test name");
    });
  });
});
