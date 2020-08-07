import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import FormTranslationsDialog from "./component";

describe("<FormTranslationsDialog />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(
      FormTranslationsDialog,
      {
        formSection: fromJS({
          name: { en: "Form Section 1 " },
          description: { en: "Description 1 " }
        }),
        currentValues: { name: {}, description: {} },
        mode: fromJS({ isEdit: true }),
        onClose: () => {},
        onSuccess: () => {}
      },
      {},
      fromJS({})
    ));
  });

  it("should render <FormTranslationsDialog />", () => {
    expect(component.find(FormTranslationsDialog)).to.have.lengthOf(1);
  });
});
