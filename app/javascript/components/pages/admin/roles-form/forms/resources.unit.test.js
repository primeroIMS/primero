import { fromJS } from "immutable";

import ResourcesForm from "./resources";

describe("pages/admin/<RolesForm>/forms - ResourcesForm", () => {
  const i18n = { t: () => "" };

  it("returns the resources form with fields", () => {
    const resourcesForm = ResourcesForm(
      fromJS({ case: ["read"] }),
      [],
      i18n,
      {}
    );

    expect(resourcesForm).to.have.lengthOf(1);
  });
});
