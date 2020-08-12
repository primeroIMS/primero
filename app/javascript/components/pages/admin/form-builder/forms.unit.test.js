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
});
