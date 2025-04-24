// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import displayNameHelper from "./display-name-helper";

describe("libs/display-name-helper.js", () => {
  const data = {
    en: "Test value",
    es: "Valor de ejemplo"
  };

  it("should return translation for 'en' locale", () => {
    expect(displayNameHelper(data, "en")).toBe("Test value");
  });
  it("should return translation for 'es' locale", () => {
    expect(displayNameHelper(data, "es")).toBe("Valor de ejemplo");
  });
  it("should return translation for default-locale if we request for a translated locale which is empty", () => {
    expect(displayNameHelper(data, "fr")).toBe("Test value");
  });
  it("should return translation empty string if data is undefined", () => {
    expect(displayNameHelper(undefined, "fr")).toBe("");
  });
});
