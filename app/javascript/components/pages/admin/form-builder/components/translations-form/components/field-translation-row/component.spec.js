// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedFormComponent, screen } from "../../../../../../../../test-utils";

import FieldTranslationRow from "./component";

describe("<FieldTranslationRow />", () => {

  const field1 = {
    name: "field_1",
    display_name: { fr: "Field 1", ar: "Field 1", en: "Field 1" },
    type: "text_field"
  };

  const state = fromJS({
    application: { primero: { locales: ["en", "fr", "ar"] } },
    records: {
      admin: {
        forms: {
          selectedFields: [
            field1,
            {
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  });

  const props = { field: fromJS(field1), selectedLocaleId: "fr", formMode: {}, formMethods: {} };

  it("should render the <FormSectionField /> for the fr language", () => {
    mountedFormComponent(<FieldTranslationRow {...props} />, { state });
    expect(document.getElementById('fields.field_1.display_name.en')).toBeInTheDocument();
    expect(document.getElementById('fields.field_1.display_name.fr')).toBeInTheDocument();
  });
  
  it("should render the <FormSectionField /> for the ar language", () => {
    const arProps = { field: fromJS(field1), selectedLocaleId: "ar", formMode: {}, formMethods: {} };
    mountedFormComponent(<FieldTranslationRow {...arProps} />, { state });
    expect(document.getElementById('fields.field_1.display_name.en')).toBeInTheDocument();
    expect(document.getElementById('fields.field_1.display_name.ar')).toBeInTheDocument();
  });
});
