import { fromJS } from "immutable";

import { FormSectionField } from "../../../../../../../form";
import { setupMockFormComponent } from "../../../../../../../../test";

import FieldTranslationRow from "./component";

describe("<FieldTranslationRow />", () => {
  let component;
  const field1 = {
    name: "field_1",
    display_name: { en: "Field 1" }
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

  beforeEach(() => {
    ({ component } = setupMockFormComponent(FieldTranslationRow, {
      props: { field: fromJS(field1), selectedLocaleId: "fr" },
      state
    }));
  });

  it("should render <FieldTranslationRow />", () => {
    expect(component.find(FieldTranslationRow)).to.have.lengthOf(1);
  });

  it("should render the <FormSectionField /> for the available languages", () => {
    const expectedNames = [
      "fields.field_1.display_name.en",
      "fields.field_1.display_name.fr",
      "fields.field_1.display_name.ar"
    ];

    const fields = component.find(FormSectionField).map(f => f.props().field.get("name"));

    expect(fields).to.deep.equal(expectedNames);
  });
});
