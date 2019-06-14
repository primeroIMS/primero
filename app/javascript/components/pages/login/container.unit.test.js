import { setupMountedComponent } from "test";
import { expect } from "chai";
import { Map } from "immutable";
import { shallow } from "enzyme";
import "test/test.setup";

import { TranslationsToggle } from "components/translations-toggle";
import { AgencyLogo } from "components/agency-logo";
import { ModuleLogo } from "components/module-logo";
import Login from "./container";

import PrimeroWhiteLogo from "images/primero-logo-white.png";
import GBVWhiteLogo from "images/gbv-logo-white.png";
import MRMWhiteLogo from "images/mrm-logo-white.png";
import CPIMSWhiteLogo from "images/cpims-logo-white.png";
import UnicefLogo from "images/unicef.png";

describe("<Login />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Login,
      { },
      Map({ Login: { logo: "primero" } })
    ).component;
  });

  it("renders default module logo", () => {
    expect(component.find("img").first().prop("src")).to.equal(PrimeroWhiteLogo);
    expect(component.find("img").first().prop("alt")).to.equal("Primero");
  });

  xit("renders default GBV logo", () => {
    component.setState({ logo: "gbv" });
    expect(component.find("img").first().prop("src")).to.equal(GBVWhiteLogo);
    expect(component.find("img").first().prop("alt")).to.equal("Primero");
  });

  xit("renders default MRM logo", () => {
    component.setProps({ logo: "mrm" });
    expect(component.find("img").first().prop("src")).to.equal(MRMWhiteLogo);
    expect(component.find("img").first().prop("alt")).to.equal("Primero");
  });

  xit("renders default CPIMS logo", () => {
    component.setProps({ logo: "cpims" });
    expect(component.find("img").first().prop("src")).to.equal(CPIMSWhiteLogo);
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

  it("renders username and password input fields", () => {
    expect(component.find("input").first().prop("name")).to.have.equal("email");
    expect(component.find("input").last().prop("name")).to.have.equal("password");
  });

  it("renders forgot password link", () => {
    expect(component.find("a").first().prop("href")).to.have.equal("/forgot_password");
  });

  it("renders login button", () => {
    expect(component.find("button").first().prop("type")).to.equal("submit");
  });
});
