import { fromJS } from "immutable";

import { expect } from "../../../../../test";

import RolesMainForm from "./roles-main";

describe("pages/admin/<RolesForm>/forms - RolesMainForm", () => {
  const i18n = { t: () => "" };

  it("returns the roles form with fields", () => {
    const rolesMainForm = RolesMainForm(fromJS([]), fromJS([]), i18n);

    expect(rolesMainForm.unique_id).to.be.equal("roles");
    expect(rolesMainForm.fields).to.have.lengthOf(6);
  });
});
