import { fromJS } from "immutable";

import AssociatedAgenciesForm from "./associated-agencies";

describe("pages/admin/<RolesForm>/forms - AssociatedAgenciesForm", () => {
  const i18n = { t: () => "" };

  it("returns the AssociatedAgenciesForm with fields", () => {
    const agencyForms = AssociatedAgenciesForm(fromJS([]), fromJS([]), i18n);

    expect(agencyForms).to.have.lengthOf(2);
    expect(agencyForms[0].fields).to.have.lengthOf(1);
    expect(agencyForms[1].fields).to.have.lengthOf(1);
  });
});
