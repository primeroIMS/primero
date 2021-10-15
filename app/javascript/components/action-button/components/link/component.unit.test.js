import { Link as MuiLink } from "@material-ui/core";

import { setupMountedThemeComponent } from "../../../../test";

import Link from "./component";

describe("<Link /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    rest: {}
  };

  it("renders a <Link /> component", () => {
    const component = setupMountedThemeComponent(Link, props);

    expect(component.find(MuiLink)).to.have.lengthOf(1);
  });
});
