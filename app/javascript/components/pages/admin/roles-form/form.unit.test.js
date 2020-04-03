import { fromJS } from "immutable";

import { expect } from "../../../../test";

import * as forms from "./form";

describe("pages/admin/<RolesForm> - form", () => {
  const i18n = { t: () => "" };

  describe("form", () => {
    it("returns the roles form with fields", () => {
      const rolesForm = forms.form(fromJS([]), fromJS([]), i18n);

      expect(rolesForm.unique_id).to.be.equal("roles");
      expect(rolesForm.fields).to.have.lengthOf(6);
    });

    it("returns the resources form with fields", () => {
      const resourcesForm = forms.resourcesForm(
        fromJS({ case: ["read"] }),
        i18n
      );

      expect(resourcesForm.unique_id).to.be.equal("resource_actions");
      expect(resourcesForm.fields).to.have.lengthOf(1);
    });

    it("returns the roles form with fields", () => {
      const roleForms = forms.roleForms(fromJS([]), fromJS([]), i18n);

      expect(roleForms).to.have.lengthOf(2);
      expect(roleForms[0].fields).to.have.lengthOf(2);
      expect(roleForms[1].fields).to.have.lengthOf(1);
    });

    it("returns the agencies form with fields", () => {
      const agencyForms = forms.agencyForms(fromJS([]), fromJS([]), i18n);

      expect(agencyForms).to.have.lengthOf(2);
      expect(agencyForms[0].fields).to.have.lengthOf(1);
      expect(agencyForms[1].fields).to.have.lengthOf(1);
    });

    it("returns the form section forms with fields", () => {
      const formSectionsForm = forms.formSectionsForm(fromJS([]), i18n);

      expect(formSectionsForm.fields).to.have.lengthOf(3);
    });
  });
});
