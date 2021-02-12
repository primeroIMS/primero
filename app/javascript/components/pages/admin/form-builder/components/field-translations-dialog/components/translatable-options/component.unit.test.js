import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../../../test";
import { FormSectionField } from "../../../../../../../form";

import TranslatableOptions from "./component";

describe("<TranslatableOptions />", () => {
  it("should render the <TranslatableOptions />", () => {
    const { component } = setupMockFormComponent(TranslatableOptions, {
      props: {
        field: fromJS({
          name: "field_1",
          option_strings_text: [{ id: "option_1", display_text: { en: "Option 1", es: "Opción 1" } }]
        }),
        selectedLocaleId: "es"
      }
    });

    expect(component.find(TranslatableOptions)).to.have.lengthOf(1);
    expect(component.find(TranslatableOptions).find(FormSectionField)).to.have.lengthOf(2);
  });
});
