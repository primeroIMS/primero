import { setupMountedComponent } from "../../../../../test";
import ActionDialog from "../../../../action-dialog";
import Form from "../../../../form";

import ImportDialog from "./component";

describe("<ImportDialog />", () => {
  let component;
  const props = {
    close: () => {},
    i18n: { t: value => value },
    open: true,
    pending: false
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ImportDialog, props, {}));
  });

  it("should render <ActionDialog />", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render <Form /> component", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("should accept valid props", () => {
    const importDialogProps = { ...component.find(ImportDialog).props() };

    ["close", "i18n", "open", "pending"].forEach(property => {
      expect(importDialogProps).to.have.property(property);
      delete importDialogProps[property];
    });
    expect(importDialogProps).to.be.empty;
  });
});
