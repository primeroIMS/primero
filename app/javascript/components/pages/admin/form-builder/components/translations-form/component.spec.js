import { fromJS } from "immutable";

import { mountedFormComponent, screen, userEvent } from "../../../../../../test-utils";

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
    mountedFormComponent(<TranslationsForm mode="new" />, state);
    expect(screen.getByText("forms.label")).toBeInTheDocument();
  });

  it("should update name and description if the translation are updated", async () => {
    const user = userEvent.setup();

    mountedFormComponent(<TranslationsForm mode="new" />, state);
    await user.type(screen.getAllByRole("textbox")[0], "name");
    await user.type(screen.getAllByRole("textbox")[1], "description");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("description");
  });
});
