import React from "react";
import { expect } from "chai";
import { setupMountedThemeComponent } from "libs/unit-test-helpers";
import "config/test.setup";

import PrimeroLogo from "images/primero-logo.png";
import MRMLogo from "images/mrm-logo.png";
import ModuleLogo from "./component";

describe("<ModuleLogo />", () => {
  it("renders a default primero module logo", () => {
    const component = setupMountedThemeComponent(ModuleLogo);
    expect(component.find("img").prop("src")).to.equal(PrimeroLogo);
  });

  it("renders a primero module logo from props", () => {
    const component = setupMountedThemeComponent(ModuleLogo, {
      moduleLogo: "mrm"
    });
    expect(component.find("img").prop("src")).to.equal(MRMLogo);
  });
});
