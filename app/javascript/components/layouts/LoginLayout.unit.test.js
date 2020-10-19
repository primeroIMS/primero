import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import TranslationsToggle from "../translations-toggle";
import AgencyLogo from "../agency-logo";
import ModuleLogo from "../module-logo";
import PrimeroWhiteLogo from "../../images/primero-logo-white.png";
import DemoIndicator from "../demo-indicator";

import LoginLayout from "./LoginLayout";

describe("<LoginLayout />", () => {
  let component;
  const state = fromJS({ LoginLayout: { module: "primero" } });

  before(() => {
    component = setupMountedComponent(LoginLayout, {}, state).component;
  });

  it("renders default PrimeroModule logo", () => {
    expect(component.find("img").first().prop("src")).to.equal(PrimeroWhiteLogo);
    expect(component.find("img").first().prop("alt")).to.equal("Primero");
  });
  it("renders a module logo", () => {
    expect(component.find(ModuleLogo)).to.have.lengthOf(1);
  });

  it("renders an agency logo", () => {
    expect(component.find(AgencyLogo)).to.have.lengthOf(1);
  });

  it("renders an TranslationsToggle component", () => {
    expect(component.find(TranslationsToggle)).to.have.lengthOf(1);
  });

  describe("when is not demo site", () => {
    it("should not render a DemoIndicator", () => {
      expect(component.find(DemoIndicator)).to.be.empty;
    });
  });

  describe("when is demo site", () => {
    const stateWithDemoIndicator = fromJS({
      LoginLayout: { module: "primero" },
      records: {
        support: {
          data: {
            demo: true
          }
        }
      }
    });
    const { component: componentWithDemoIndicator } = setupMountedComponent(LoginLayout, {}, stateWithDemoIndicator);

    it("should render a DemoIndicator", () => {
      expect(componentWithDemoIndicator.find(DemoIndicator)).to.have.lengthOf(1);
    });
  });
});
