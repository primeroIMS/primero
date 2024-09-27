// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { SELECT_FIELD, SUBFORM_SECTION, TEXT_FIELD, TICK_FIELD } from "../../../../../form";
import { mountedFormComponent, screen } from "../../../../../../test-utils";

import FieldTranslationsDialog from "./component";
import { NAME } from "./constants";

describe("<FieldTranslationsDialog />", () => {
  const state = fromJS({
    ui: { dialogs: { [NAME]: true } },
    application: { primero: { locales: ["en", "fr", "ar"] } }
  });

  it("should render <FieldTranslationsDialog />", () => {
    const props = {
      field: fromJS({
        name: "field_1",
        type: TEXT_FIELD,
        display_name: { en: "Field 1" }
      }),
      currentValues: {
        field_1: { display_name: { en: "Field 1" } }
      },
      open: true,
      mode: "edit"
    };

    mountedFormComponent(<FieldTranslationsDialog {...props} />, { state });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render translation fields for TEXT_FIELD", () => {
    const props = {
      field: fromJS({
        name: "field_1",
        type: TEXT_FIELD,
        display_name: { en: "Field 1" }
      }),
      currentValues: {},
      open: true,
      mode: "edit"
    };

    mountedFormComponent(<FieldTranslationsDialog {...props} />, { state });

    const expectedFieldNames = [
      "field_1.display_name.fr",
      "field_1.display_name.ar",
      "field_1.help_text.fr",
      "field_1.help_text.ar",
      "field_1.guiding_questions.fr",
      "field_1.guiding_questions.ar"
    ];

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").map(tb => tb.getAttribute("id"))).toStrictEqual(expectedFieldNames);
  });

  // Redux not accepting store state key records. Needs investigation.
  it.skip("should render translation fields for SUBFORM_SECTION", () => {
    const props = {
      field: fromJS({
        name: "field_1",
        type: SUBFORM_SECTION,
        display_name: { en: "Field 1" }
      }),
      currentValues: {},
      mode: "edit",
      open: true
    };

    const storeState = state.merge({
      records: {
        admin: {
          forms: {
            selectedSubform: fromJS({
              name: { en: "Subform 1" }
            })
          }
        }
      }
    });

    mountedFormComponent(<FieldTranslationsDialog {...props} />, {
      state: storeState
    });

    const expectedFieldNames = [
      "subform_section.name.fr",
      "subform_section.name.ar",
      "subform_section.description.fr",
      "subform_section.description.ar"
    ];

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").map(tb => tb.getAttribute("id"))).toStrictEqual(expectedFieldNames);
  });

  it("should render translation fields for TICK_FIELD", () => {
    const props = {
      field: fromJS({
        name: "field_1",
        type: TICK_FIELD
      }),
      currentValues: {},
      mode: "edit",
      open: true
    };

    mountedFormComponent(<FieldTranslationsDialog {...props} />, {
      state
    });

    const expectedFieldNames = [
      "field_1.display_name.fr",
      "field_1.display_name.ar",
      "field_1.help_text.fr",
      "field_1.help_text.ar",
      "field_1.guiding_questions.fr",
      "field_1.guiding_questions.ar",
      "field_1.tick_box_label.fr",
      "field_1.tick_box_label.ar"
    ];

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").map(tb => tb.getAttribute("id"))).toStrictEqual(expectedFieldNames);
  });

  it("should render translation fields for SELECT_FIELD with manual options", () => {
    const props = {
      field: fromJS({
        name: "field_1",
        type: SELECT_FIELD,
        option_strings_text: [{ id: "option_1", display_text: { en: "Option 1", es: "Opción 1" } }]
      }),
      currentValues: {},
      mode: "edit",
      open: true
    };

    mountedFormComponent(<FieldTranslationsDialog {...props} />, {
      state
    });

    const expectedFieldNames = [
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

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").map(tb => tb.getAttribute("id"))).toStrictEqual(expectedFieldNames);
  });
});
