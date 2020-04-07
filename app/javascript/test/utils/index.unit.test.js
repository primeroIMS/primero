import { expect } from "chai";

import * as moduleToTest from "./index";

describe("app/javascript/test/utils/index", () => {
  const clone = { ...moduleToTest };

  after(() => {
    expect(clone).to.be.empty;
  });

  [
    "setupMockFieldComponent",
    "setupMockFormComponent",
    'setupMountedComponent',
    "setupMountedThemeComponent",
    "tick"
  ].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });
});
