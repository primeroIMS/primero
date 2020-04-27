import { fromJS } from "immutable";

import AssociatedFormSectionsForm from "./associated-form-sections";

describe("pages/admin/<RolesForm>/forms - AssociatedFormSectionsForm", () => {
  const i18n = { t: () => "" };

  it("returns the AssociatedFormSectionsForm with fields", () => {
    const formSectionsForm = AssociatedFormSectionsForm(fromJS([]), i18n);

    expect(formSectionsForm).to.have.lengthOf(3);
  });
});
