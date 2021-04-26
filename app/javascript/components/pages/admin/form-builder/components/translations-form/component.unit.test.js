import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";
import { FormSectionField } from "../../../../../form";

import TranslationsForm from "./component";

describe("<TranslationsForm />", () => {
  let component;

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

  beforeEach(() => {
    ({ component } = setupMockFormComponent(TranslationsForm, { props: { mode: "new" }, state }));
  });

  it("should render <TranslationsForm />", () => {
    expect(component.find(TranslationsForm)).to.have.lengthOf(1);
  });

  it("should update name and description if the translation are updated", () => {
    const { register, getValues } = component.find(FormSectionField).at(0).props().formMethods;

    register({ name: "name.en" });
    register({ name: "description.en" });

    component
      .find(TranslationsForm)
      .find("input[name='translations.name.en']")
      .simulate("blur", { target: { value: "Updated Name", name: "translations.name.en" } });

    component
      .find(TranslationsForm)
      .find("input[name='translations.description.en']")
      .simulate("blur", { target: { value: "Updated Description", name: "translations.description.en" } });

    expect(getValues().name.en).to.equal("Updated Name");
    expect(getValues().description.en).to.equal("Updated Description");
  });
});
