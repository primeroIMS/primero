// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import AssociatedFormSectionsForm from "./associated-form-sections";

describe("pages/admin/<RolesForm>/forms - AssociatedFormSectionsForm", () => {
  const i18n = { t: () => "" };

  it("returns the AssociatedFormSectionsForm with fields", () => {
    const formSectionsForm = AssociatedFormSectionsForm(fromJS([]), i18n);

    expect(formSectionsForm).toHaveLength(5);
  });
});
