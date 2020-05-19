import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import ActionDialog from "./component";

describe("<ActionDialog />", () => {
  let component;
  const props = {
    open: true,
    successHandler: () => {},
    cancelHandler: () => {},
    dialogTitle: "",
    dialogSubtitle: "Test Subtitle",
    dialogText: "",
    confirmButtonLabel: "",
    children: [],
    onClose: () => {},
    confirmButtonProps: {},
    omitCloseAfterSuccess: false,
    dialogSubHeader: "Test SubHeader"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ActionDialog, props, {}));
  });

  it("should render Dialog", () => {
    expect(component.find(Dialog)).to.have.lengthOf(1);
  });

  it("should render DialogActions", () => {
    expect(component.find(DialogActions)).to.have.lengthOf(1);
  });

  it("should render DialogContent", () => {
    expect(component.find(DialogContent)).to.have.lengthOf(1);
  });

  it("should render DialogTitle", () => {
    expect(component.find(DialogTitle)).to.have.lengthOf(1);
  });

  it("should render IconButton", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("should render Button", () => {
    expect(component.find(Button)).to.have.lengthOf(2);
  });

  it("should accept valid props", () => {
    const actionDialogProps = { ...component.find(ActionDialog).props() };

    expect(component.find(ActionDialog)).to.have.lengthOf(1);
    [
      "open",
      "successHandler",
      "cancelHandler",
      "dialogTitle",
      "dialogText",
      "confirmButtonLabel",
      "children",
      "onClose",
      "confirmButtonProps",
      "omitCloseAfterSuccess",
      "dialogSubtitle",
      "enabledSuccessButton",
      "dialogSubHeader"
    ].forEach(property => {
      expect(actionDialogProps).to.have.property(property);
      delete actionDialogProps[property];
    });
    expect(actionDialogProps).to.be.empty;
  });

  it("should render DialogSubtitle with it's correct value ", () => {
    expect(component.find(DialogTitle).text()).to.be.equal("Test Subtitle");
  });

  it("should render dialogSubHeader with it's correct value ", () => {
    expect(component.find(Typography).last().text()).to.be.equal(
      "Test SubHeader"
    );
  });

  it("should not render DialogSubtitle because isn't passed in props ", () => {
    delete props.dialogSubtitle;
    const { component: componentWithoutSubtitle } = setupMountedComponent(
      ActionDialog,
      props,
      {}
    );

    expect(componentWithoutSubtitle.find(DialogTitle).text()).to.be.empty;
  });

  it("should not render dialogSubHeader because isn't passed in props ", () => {
    delete props.dialogSubHeader;
    const { component: componentWithoutSubtitle } = setupMountedComponent(
      ActionDialog,
      props,
      {}
    );

    expect(componentWithoutSubtitle.find(Typography)).to.be.empty;
  });
});
