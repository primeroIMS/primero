import * as moduleToTest from "./index";

describe("app/javascript/test/index", () => {
  const clone = { ...moduleToTest };

  after(() => {
    expect(clone).to.be.empty;
  });

  [
    "setupMockFieldComponent",
    "setupMockFormComponent",
    "setupMountedComponent",
    "setupMountedThemeComponent",
    "spy",
    "stub",
    "tick",
    "useFakeTimers",
    "mock",
    "createSimpleMount"
  ].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });
});
