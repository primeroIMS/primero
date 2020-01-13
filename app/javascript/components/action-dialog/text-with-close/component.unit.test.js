import { expect } from "chai";
import { DialogTitle, IconButton } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";

import TitleWithClose from "./component";

describe("<TitleWithClose />", () => {
  let component;
  const props = {
    closeHandler: () => {},
    dialogSubtitle: "Test Subtitle",
    dialogTitle: "Test Title"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TitleWithClose, props, {}));
  });

  it("should render DialogTitle", () => {
    expect(component.find(DialogTitle)).to.have.lengthOf(1);
  });

  it("should render IconButton", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("should accept valid props", () => {
    const TitleWithCloseProps = { ...component.find(TitleWithClose).props() };

    expect(component.find(TitleWithClose)).to.have.lengthOf(1);
    ["closeHandler", "dialogSubtitle", "dialogTitle"].forEach(property => {
      expect(TitleWithCloseProps).to.have.property(property);
      delete TitleWithCloseProps[property];
    });
    expect(TitleWithCloseProps).to.be.empty;
  });

  it("should render a title with subtitle ", () => {
    expect(component.find(DialogTitle).text()).to.be.equal(
      "Test TitleTest Subtitle"
    );
  });

  it("should render a title without subtitle", () => {
    delete props.dialogSubtitle;
    const { component: componentWithoutSubtitle } = setupMountedComponent(
      TitleWithClose,
      props,
      {}
    );

    expect(componentWithoutSubtitle.find(DialogTitle).text()).to.be.equal(
      "Test Title"
    );
  });
});
