import displayNameHelper from "./display-name-helper";

describe("libs/display-name-helper.js", () => {
  const data = {
    en: "Test value",
    es: "Valor de ejemplo"
  };

  it("should return translation for 'en' locale", () => {
    expect(displayNameHelper(data, "en")).to.be.equals("Test value");
  });
  it("should return translation for 'es' locale", () => {
    expect(displayNameHelper(data, "es")).to.be.equals("Valor de ejemplo");
  });
  it("should return translation for default-locale if we request for a translated locale which is empty", () => {
    expect(displayNameHelper(data, "fr")).to.be.equals("Test value");
  });
  it("should return translation empty string if data is undefined", () => {
    expect(displayNameHelper(undefined, "fr")).to.be.equals("");
  });
});
