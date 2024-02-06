import { fromJS } from "immutable";

import { mountedFormComponent, screen } from "../../../../../../../../test-utils";

import TranslatableOptions from "./component";

describe("<TranslatableOptions />", () => {
  it("should render the <TranslatableOptions />", () => {
  const props = {
    field: fromJS({
      name: "field_1",
      type: "select_box",
      option_strings_text: [{ id: "option_1", display_text: { en: "Option 1", es: "Opción 1" } }]
    }),
    selectedLocaleId: "es"
  }
    mountedFormComponent(<TranslatableOptions {...props} />)

    expect(screen.getByText('fields.english_text')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  });
});
