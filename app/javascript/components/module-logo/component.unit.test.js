import { expect } from "chai";

import PrimeroLogo from "../../images/primero-logo.png";
import MRMLogo from "../../images/mrm-logo.png";
import { setupMountedThemeComponent } from "../../test";

import ModuleLogo from "./component";

describe("<ModuleLogo />", () => {
  it("renders a default primero module logo", () => {
    const component = setupMountedThemeComponent(ModuleLogo);
    expect(component.find("img").prop("src")).to.equal(PrimeroLogo);
  });

  it("renders a primero module logo from props", () => {
    const component = setupMountedThemeComponent(ModuleLogo, {
      moduleLogo: "primeromodule-mrm"
    });
    expect(component.find("img").prop("src")).to.equal(MRMLogo);
  });
});
