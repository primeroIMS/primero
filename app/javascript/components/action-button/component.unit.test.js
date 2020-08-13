import React from "react";

import { setupMountedThemeComponent } from "../../test";

import { DefaultButton, IconButton } from "./components";
import ActionButton from "./component";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<ActionButton />", () => {
  const props = {
    icon: <></>,
    isCancel: false,
    isTransparent: false,
    pending: false,
    text: "Test",
    type: ACTION_BUTTON_TYPES.default,
    rest: {}
  };

  it("renders DefaultButton type", () => {
    const component = setupMountedThemeComponent(ActionButton, props);

    expect(component.find(DefaultButton)).to.have.lengthOf(1);
  });

  it("renders IconButton type", () => {
    const component = setupMountedThemeComponent(ActionButton, {
      ...props,
      type: ACTION_BUTTON_TYPES.icon
    });

    expect(component.find(IconButton)).to.have.lengthOf(1);
  });
});
