import { fromJS } from "immutable";

import ResourcesForm from "./resources";

describe("pages/admin/<RolesForm>/forms - ResourcesForm", () => {
  const i18n = { t: () => "" };

  it("returns the resources form with fields", () => {
    const resourcesForm = ResourcesForm(fromJS({ case: ["read"] }), i18n);

    expect(resourcesForm.unique_id).to.be.equal("resource_actions");
    expect(resourcesForm.fields).to.have.lengthOf(1);
  });
});
