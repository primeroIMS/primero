import { expect } from "../../test";

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
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
