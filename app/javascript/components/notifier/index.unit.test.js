// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Notifier />- index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "CLOSE_SNACKBAR",
      "closeSnackbar",
      "ENQUEUE_SNACKBAR",
      "enqueueSnackbar",
      "generate",
      "default",
      "reducer",
      "REMOVE_SNACKBAR",
      "removeSnackbar",
      "SNACKBAR_VARIANTS"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
