import { fromJS } from "immutable";

import { mountedFormComponent, screen  } from "../../../../../../test-utils";

import TranslationsForm from "./component";

describe("<TranslationsForm />", () => {
  const state = fromJS({
    application: { locales: ["en", "fr", "ar"] },
    records: {
      admin: {
        forms: {
          selectedFields: [
            {
              name: "field_1",
              display_name: { en: "Field 1" }
            },
            {
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  });


  it("should render <TranslationsForm />", () => {
    mountedFormComponent(<TranslationsForm mode="new" />, state)
    expect(screen.getByText('forms.label')).toBeInTheDocument();
  });

  it("should update name and description if the translation are updated", () => {
    mountedFormComponent(<TranslationsForm mode="new" />, state)
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
  });
});
