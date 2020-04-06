import { expect } from "../../../../../test";

import Validations from "./validations";

describe("pages/admin/<RolesForm>/forms - Validations", () => {
  const i18n = { t: () => "" };
  const mode = { isShow: true };

  it("returns an object with the fields to validate", () => {
    const validations = Validations(mode, i18n);

    expect(validations.fields.name).to.be.an("object");
    expect(validations.fields.permissions).to.be.an("object");
  });
});
