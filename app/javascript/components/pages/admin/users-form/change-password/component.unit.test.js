import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../test";
import ActionDialog from "../../../../action-dialog";

import ChangePassword from "./component";

describe("<ChangePassword /> - Component", () => {
  let component;
  const props = {
    formMode: fromJS({ isEdit: true }),
    i18n: { t: value => value },
    open: true,
    pending: false,
    setOpen: () => {},
    commonInputProps: {
      label: "Test label"
    },
    parentFormMethods: {
      setValue() {}
    }
  };

  beforeEach(() => {
    ({ component } = setupMockFormComponent(ChangePassword, { props }));
  });

  it("should render 2 ActionDialog components", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(2);
  });

  it("should render 1 form", () => {
    expect(component.find("form")).to.have.lengthOf(1);
  });

  it("should have valid props", () => {
    const changePasswordProps = component.find(ChangePassword).props();
    const expectedProps = [
      "formMode",
      "i18n",
      "open",
      "pending",
      "setOpen",
      "commonInputProps",
      "parentFormMethods",
      "formMethods"
    ];

    expect(Object.keys(changePasswordProps)).to.deep.equals(expectedProps);
  });
});
