import { setupMountedComponent } from "test";
import { expect } from "chai";
import { Map } from "immutable";
import "test/test.setup";

import { TranslationsToggle } from "components/translations-toggle";
import { AgencyLogo } from "components/agency-logo";
import { ModuleLogo } from "components/module-logo";
import LoginLayout from "./LoginLayout";

import PrimeroWhiteLogo from "images/primero-logo-white.png";
import UnicefLogo from "images/unicef.png";

describe("<LoginLayout />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      LoginLayout,
      {},
      Map({ LoginLayout: { module: "primero" } })
    ).component;
  });

  it("renders default PrimeroModule logo", () => {
    expect(component.find("img").first().prop("src")).to.equal(PrimeroWhiteLogo);
    expect(component.find("img").first().prop("alt")).to.equal("Primero");
  });

  it("renders default agency logo", () => {
    expect(component.find("img").last().prop("src")).to.equal(UnicefLogo);
    expect(component.find("img").last().prop("alt")).to.equal("unicef");
  });

  it("renders a module logo", () => {
    expect(component.find(ModuleLogo)).to.have.length(1);
  });

  it("renders an agency logo", () => {
    expect(component.find(AgencyLogo)).to.have.length(1);
  });

  it("renders an TranslationsToggle component", () => {
    expect(component.find(TranslationsToggle)).to.have.length(1);
  });

});
