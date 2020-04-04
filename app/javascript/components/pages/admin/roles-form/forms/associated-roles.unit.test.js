import { fromJS } from "immutable";

import { expect } from "../../../../../test";

import AssociatedRolesForm from "./associated-roles";

describe("pages/admin/<RolesForm>/forms - AssociatedRolesForm", () => {
  const i18n = { t: () => "" };

  it("returns the AssociatedRolesForm with fields", () => {
    const roleForms = AssociatedRolesForm(fromJS([]), fromJS([]), i18n);

    expect(roleForms).to.have.lengthOf(2);
    expect(roleForms[0].fields).to.have.lengthOf(2);
    expect(roleForms[1].fields).to.have.lengthOf(1);
  });
});
