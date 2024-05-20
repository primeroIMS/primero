import { mountedFormComponent, screen } from "test-utils";

import TranslationsNote from "./component";

describe("<SettingsTab />", () => {
  const props = {
    moduleId: "primeromodule-my-module",
    parentForm: "parent"
  };

  const state = {
    forms: {
      options: { lookups: [{ id: 1, unique_id: "lookup-form-group-my-module-parent" }] }
    }
  };

  beforeEach(() => {
    mountedFormComponent(<TranslationsNote {...props} />, { state });
  });

  it("should render <SettingsTab />", () => {
    expect(screen.getByText("forms.translations.note")).toBeInTheDocument();
  });

  it("should render a link to the lookup", () => {
    const linkElement = screen.getByText("forms.translations.edit_form_group");
    const hrefAttributeValue = linkElement.getAttribute("href");

    expect(hrefAttributeValue).toBe("/admin/lookups/1/edit");
  });
});
