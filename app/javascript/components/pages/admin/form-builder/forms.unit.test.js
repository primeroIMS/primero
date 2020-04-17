import { settingsForm } from "./forms";

describe("pages/admin/<FormBuilder>/forms", () => {
  const i18n = { t: () => "" };

  it("returns the forms", () => {
    const forms = settingsForm(i18n);
    expect(forms.find(form => form.unique_id === "settings")).to.exist;
    expect(forms.find(form => form.unique_id === "visibility")).to.exist;
  });
});
