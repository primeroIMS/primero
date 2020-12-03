import { setupMountedComponent } from "../../../../test";
import ActionDialog from "../../../action-dialog";
import DialogTabs from "../dialog-tabs";

import FlagDialog from "./component";

describe("<FlagDialog />", () => {
  let component;

  const props = {
    children: [{ props: { hidetab: true } }],
    isBulkFlags: false,
    tab: 0,
    setTab: () => {},
    dialogOpen: true
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(FlagDialog, props));
  });

  it("should render the FlagDialog", () => {
    expect(component.find(FlagDialog)).to.have.lengthOf(1);
  });

  it("should render the ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render the DialogTabs", () => {
    expect(component.find(DialogTabs)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const flagDialogProps = { ...component.find(FlagDialog).props() };

    ["children", "isBulkFlags", "tab", "setTab", "dialogOpen"].forEach(property => {
      expect(flagDialogProps).to.have.property(property);
      delete flagDialogProps[property];
    });
    expect(flagDialogProps).to.be.empty;
  });
});
