import { IconButton as MuiIconButton } from "@material-ui/core";

import { setupMountedThemeComponent } from "../../../../test";

import IconButton from "./component";

describe("<IconButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    rest: {}
  };

  it("renders a <IconButton /> component", () => {
    const component = setupMountedThemeComponent(IconButton, props);

    expect(component.find(MuiIconButton)).to.have.lengthOf(1);
  });
});
