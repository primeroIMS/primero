import { fromJS } from "immutable";

import { settingsForm } from "./forms";

describe("pages/admin/<FormBuilder>/forms", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({ isEdit: true });

  it("returns the forms", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings")).to.exist;
    expect(forms.find(form => form.unique_id === "visibility")).to.exist;
  });

  it("should have actions if is edit mode", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings").actions).to.have.lengthOf(1);
  });

  it("should not have actions if is not edit mode", () => {
    const forms = settingsForm({ i18n, formMode: fromJS({ isNew: true }) });

    expect(forms.find(form => form.unique_id === "settings").actions).to.have.lengthOf(0);
  });

  it("should have fields", () => {
    const forms = settingsForm({ i18n, formMode });

    expect(forms.find(form => form.unique_id === "settings").fields).to.have.lengthOf(4);
  });

  it("should have module and record_type fields before form_group", () => {
    const forms = settingsForm({ i18n, formMode });
    const { fields } = forms.find(form => form.unique_id === "settings");

    expect(fields[2].row.map(field => field.name)).to.deep.equal(["module_ids", "parent_form"]);
    expect(fields[3].name).to.equal("form_group_id");
  });
});
