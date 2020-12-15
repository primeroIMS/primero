import { fromJS } from "immutable";

import { translationsForm } from "./forms";

describe("pages/admin/<FormBuilder>/<FormTranslationsDialog/>/forms", () => {
  const i18n = { t: value => value };
  const formSection = fromJS({
    name: { en: "Form Section 1 " },
    description: { en: "Description 1 " }
  });
  const locales = fromJS([{ id: "fr" }, { id: "es" }]);
  const selectedLocaleId = "es";

  it("returns the forms", () => {
    const forms = translationsForm({
      i18n,
      formSection,
      locales,
      selectedLocaleId,
      currentValues: { name: "Form 1", description: "Form Description 1" }
    });

    expect(forms.find(form => form.unique_id === "edit_translations")).to.exist;
    expect(forms.find(form => form.unique_id === "form_title")).to.exist;
    expect(forms.find(form => form.unique_id === "form_description")).to.exist;
  });
});
