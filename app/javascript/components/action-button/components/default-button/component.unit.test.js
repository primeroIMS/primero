import React from "react";
import { Button, CircularProgress } from "@material-ui/core";

import { setupMountedThemeComponent } from "../../../../test";

import IconButton from "./component";

describe("<DefaultButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    isCancel: false,
    pending: false,
    text: "Test",
    rest: {}
  };

  it("renders a <Button /> component", () => {
    const component = setupMountedThemeComponent(IconButton, props);

    expect(component.find(Button)).to.have.lengthOf(1);
    expect(component.find(CircularProgress)).to.be.empty;
  });

  it("renders a <Button /> and a <CircularProgress /> component", () => {
    const component = setupMountedThemeComponent(IconButton, {
      ...props,
      pending: true
    });

    expect(component.find(Button)).to.have.lengthOf(1);
    expect(component.find(CircularProgress)).to.have.lengthOf(1);
  });
});
