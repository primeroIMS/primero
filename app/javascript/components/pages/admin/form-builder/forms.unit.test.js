// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { settingsForm } from "./forms";

describe("pages/admin/<FormBuilder>/forms", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({ isEdit: true });

  it("returns the forms", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings")).toBeDefined();
    expect(forms.find(form => form.unique_id === "visibility")).toBeDefined();
  });

  it("should have actions if is edit mode", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings").actions).toHaveLength(1);
  });

  it("should not have actions if is not edit mode", () => {
    const forms = settingsForm({ i18n, formMode: fromJS({ isNew: true }) });

    expect(forms.find(form => form.unique_id === "settings").actions).toHaveLength(0);
  });

  it("should have fields", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings").fields).toHaveLength(4);
  });

  it("should have module and record_type fields before form_group", () => {
    const forms = settingsForm({ i18n, formMode });
    const { fields } = forms.find(form => form.unique_id === "settings");

    expect(fields[2].row.map(field => field.name)).toEqual(["module_ids", "parent_form"]);
    expect(fields[3].name).toBe("form_group_id");
  });
});
