import { IconButton, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import SnackbarAction from "./component";

describe("<SnackbarAction />", () => {
  let component;
  const props = {
    actionLabel: "Test",
    actionUrl: "/test",
    closeSnackbar: () => {},
    key: 1234,
    hideCloseIcon: false
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SnackbarAction, props));
  });

  it("should render 1 Button component", () => {
    expect(component.find(Button)).to.have.lengthOf(1);
  });

  it("should render 1 IconButton component", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  describe("when hideCloseIcon is true", () => {
    const { component: hiddenIconButtonComponent } = setupMountedComponent(SnackbarAction, props);

    it("should render 1 Button component", () => {
      expect(component.find(Button)).to.have.lengthOf(1);
    });

    it("should not render IconButton component", () => {
      expect(hiddenIconButtonComponent.find(IconButton)).to.be.empty;
    });
  });
});
