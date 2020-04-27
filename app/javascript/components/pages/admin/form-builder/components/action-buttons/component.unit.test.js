import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../test";
import { FormAction } from "../../../../../form";

import FormBuilderActionButtons from "./component";

describe("<FormBuilderActionButtons />", () => {
  let component;
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      FormBuilderActionButtons,
      {
        formMode: fromJS({ isNew: true }),
        formRef: {},
        handleCancel: () => {}
      },
      initialState
    ));
  });

  it("renders the FormBuilderActionButtons", () => {
    const findButtonWithtext = text =>
      component.findWhere(elem => elem.text() === text);

    expect(component.find(FormAction)).to.have.lengthOf(2);

    expect(findButtonWithtext("buttons.cancel")).to.exist;
    expect(findButtonWithtext("buttons.save")).to.exist;
  });
});
