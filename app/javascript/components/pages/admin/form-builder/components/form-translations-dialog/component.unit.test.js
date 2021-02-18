import { setupMockFormComponent } from "../../../../../../test";

import FormTranslationsDialog from "./component";

describe("<FormTranslationsDialog />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(FormTranslationsDialog, {
      props: {
        mode: "edit",
        getValues: value => value,
        reset: value => value,
        onClose: () => {},
        onSuccess: () => {}
      }
    }));
  });

  it("should render <FormTranslationsDialog />", () => {
    expect(component.find(FormTranslationsDialog)).to.have.lengthOf(1);
  });
});
