import getTranslatedText from "./get-translated-text";

describe("translatedText", () => {
  const i18n = { locale: "en" };

  it("should return the same displayText if not localized", () => {
    expect(getTranslatedText("string", i18n)).to.be.equal("string");
  });

  it("should return the translated displayText for english", () => {
    expect(getTranslatedText({ en: "string" }, i18n)).to.be.equal("string");
  });

  it("should return empty if the translation does not exist", () => {
    expect(getTranslatedText({ fr: "string" }, i18n)).to.be.equal("");
  });
});
