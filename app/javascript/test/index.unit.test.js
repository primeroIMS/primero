import { expect } from "chai";

import * as moduleToTest from "./index";

describe("app/javascript/test/index", () => {
  const clone = { ...moduleToTest };

  after(() => {
    expect(clone).to.be.empty;
  });

  [
    'expect',
    "setupMockFieldComponent",
    "setupMockFormComponent",
    'setupMountedComponent',
    "setupMountedThemeComponent",
    'spy',
    'stub',
    "tick",
    'useFakeTimers'
  ].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });
});
