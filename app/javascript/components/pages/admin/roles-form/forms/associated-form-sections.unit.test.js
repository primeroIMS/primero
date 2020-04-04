import { fromJS } from "immutable";

import { expect } from "../../../../../test";

import AssociatedFormSectionsForm from "./associated-form-sections";

describe("pages/admin/<RolesForm>/forms - AssociatedFormSectionsForm", () => {
  const i18n = { t: () => "" };

  it("returns the AssociatedFormSectionsForm with fields", () => {
    const formSectionsForm = AssociatedFormSectionsForm(fromJS([]), i18n);

    expect(formSectionsForm.fields).to.have.lengthOf(3);
  });
});
