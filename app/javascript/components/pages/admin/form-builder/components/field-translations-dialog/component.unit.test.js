import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";
import { FormSectionField, SUBFORM_SECTION, SELECT_FIELD, TEXT_FIELD, TICK_FIELD } from "../../../../../form";

import { TranslatableOptions } from "./components";
import FieldTranslationsDialog from "./component";
import { NAME } from "./constants";

describe("<FieldTranslationsDialog />", () => {
  const state = fromJS({
    ui: { dialogs: { [NAME]: true } },
    application: { primero: { locales: ["en", "fr", "ar"] } }
  });

  it("should render <FieldTranslationsDialog />", () => {
    const { component } = setupMockFormComponent(FieldTranslationsDialog, {
      props: {
        field: fromJS({
          name: "field_1",
          type: TEXT_FIELD,
          display_name: { en: "Field 1" }
        }),
        currentValues: {
          field_1: { display_name: { en: "Field 1" } }
        },
        mode: "edit"
      },
      state
    });

    expect(component.find(FieldTranslationsDialog)).to.have.lengthOf(1);
  });

  it("should render translation fields for TEXT_FIELD", () => {
    const { component } = setupMockFormComponent(FieldTranslationsDialog, {
      props: {
        field: fromJS({
          name: "field_1",
          type: TEXT_FIELD,
          display_name: { en: "Field 1" }
        }),
        currentValues: {},
        open: true,
        mode: "edit"
      },
      state
    });

    const expectedFieldNames = [
      "locale_id",
      "field_1.display_name.fr",
      "field_1.display_name.ar",
      "field_1.help_text.fr",
      "field_1.help_text.ar",
      "field_1.guiding_questions.fr",
      "field_1.guiding_questions.ar"
    ];

    const fieldNames = component
      .find(FieldTranslationsDialog)
      .find(FormSectionField)
      .map(field => field.props().field.name);

    expect(component.find(FieldTranslationsDialog).find(FormSectionField)).to.have.lengthOf(7);
    expect(fieldNames).to.deep.equal(expectedFieldNames);
  });

  it("should render translation fields for SUBFORM_SECTION", () => {
    const { component } = setupMockFormComponent(FieldTranslationsDialog, {
      props: {
        field: fromJS({
          name: "field_1",
          type: SUBFORM_SECTION,
          display_name: { en: "Field 1" }
        }),
        currentValues: {},
        mode: "edit",
        open: true
      },
      state: state.merge({
        records: {
          admin: {
            forms: {
              selectedSubform: fromJS({
                name: { en: "Subform 1" }
              })
            }
          }
        }
      })
    });

    const expectedFieldNames = [
      "locale_id",
      "subform_section.name.fr",
      "subform_section.name.ar",
      "subform_section.description.fr",
      "subform_section.description.ar"
    ];

    const fieldNames = component
      .find(FieldTranslationsDialog)
      .find(FormSectionField)
      .map(field => field.props().field.name);

    expect(component.find(FieldTranslationsDialog).find(FormSectionField)).to.have.lengthOf(5);
    expect(fieldNames).to.deep.equal(expectedFieldNames);
  });

  it("should render translation fields for TICK_FIELD", () => {
    const { component } = setupMockFormComponent(FieldTranslationsDialog, {
      props: {
        field: fromJS({
          name: "field_1",
          type: TICK_FIELD
        }),
        currentValues: {},
        mode: "edit",
        open: true
      },
      state
    });

    const expectedFieldNames = [
      "locale_id",
      "field_1.display_name.fr",
      "field_1.display_name.ar",
      "field_1.help_text.fr",
      "field_1.help_text.ar",
      "field_1.guiding_questions.fr",
      "field_1.guiding_questions.ar",
      "field_1.tick_box_label.fr",
      "field_1.tick_box_label.ar"
    ];

    const fieldNames = component
      .find(FieldTranslationsDialog)
      .find(FormSectionField)
      .map(field => field.props().field.name);

    expect(component.find(FieldTranslationsDialog).find(FormSectionField)).to.have.lengthOf(9);
    expect(fieldNames).to.deep.equal(expectedFieldNames);
  });

  it("should render translation fields for SELECT_FIELD with manual options", () => {
    const { component } = setupMockFormComponent(FieldTranslationsDialog, {
      props: {
        field: fromJS({
          name: "field_1",
          type: SELECT_FIELD,
          option_strings_text: [{ id: "option_1", display_text: { en: "Option 1", es: "Opción 1" } }]
        }),
        currentValues: {},
        mode: "edit",
        open: true
      },
      state
    });

    const expectedFieldNames = [
      "locale_id",
      "field_1.display_name.fr",
      "field_1.display_name.ar",
      "field_1.help_text.fr",
      "field_1.help_text.ar",
      "field_1.guiding_questions.fr",
      "field_1.guiding_questions.ar",
      "field_1.option_strings_text[0].id",
      "field_1.option_strings_text[0].display_text.en",
      "field_1.option_strings_text[0].id",
      "field_1.option_strings_text[0].display_text.fr",
      "field_1.option_strings_text[0].id",
      "field_1.option_strings_text[0].display_text.ar"
    ];

    const fieldNames = component
      .find(FieldTranslationsDialog)
      .find(FormSectionField)
      .map(field => field.props().field.name);

    expect(component.find(FieldTranslationsDialog).find(FormSectionField)).to.have.lengthOf(13);
    expect(fieldNames).to.deep.equal(expectedFieldNames);
    expect(component.find(TranslatableOptions)).to.have.lengthOf(1);
  });
});
