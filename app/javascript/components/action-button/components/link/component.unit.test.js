import { Fab } from "@material-ui/core";

import { setupMountedThemeComponent } from "../../../../test";

import Link from "./component";

describe("<Link /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    rest: {}
  };

  it("renders a <Fab /> component", () => {
    const component = setupMountedThemeComponent(Link, props);

    expect(component.find(Fab)).to.have.lengthOf(1);
  });
});
