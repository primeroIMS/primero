// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Notifier/> - constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["SNACKBAR_VARIANTS"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });

  it("should have known SNACKBAR_VARIANTS properties", () => {
    const clonedConstants = { ...constants.SNACKBAR_VARIANTS };

    ["error", "info", "success", "warning"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
