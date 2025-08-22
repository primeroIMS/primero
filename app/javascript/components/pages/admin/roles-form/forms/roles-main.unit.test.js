// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import RolesMainForm from "./roles-main";

describe("pages/admin/<RolesForm>/forms - RolesMainForm", () => {
  const i18n = { t: () => "" };

  it("returns the roles form with fields", () => {
    const rolesMainForm = RolesMainForm(fromJS([]), i18n, fromJS({}));

    expect(rolesMainForm.unique_id).toBe("roles");
    expect(rolesMainForm.fields).toHaveLength(10);
    expect(rolesMainForm.fields.filter(field => field.required).map(field => field.name)).toEqual([
      "name",
      "module_unique_ids"
    ]);
  });
});
