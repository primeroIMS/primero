import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";
import { MenuItem } from "@material-ui/core";

import { setupMountedComponent, stub } from "../../../../test";
import TranslationsToggle from "../../../translations-toggle";
import AgencyLogo from "../../../agency-logo";
import ModuleLogo from "../../../module-logo";
import PrimeroWhiteLogo from "../../../../images/primero-logo-white.png";
import DemoIndicator from "../../../demo-indicator";

import LoginLayout from "./component";

describe("layouts/components/<LoginLayout />", () => {
  let component;
  const state = fromJS({
    LoginLayout: { module: "primero" },
    application: { primero: { locales: ["en", "es", "ar"] } }
  });

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
    component.find("button").at(0).simulate("click");
    expect(component.find(TranslationsToggle).find(MenuItem)).to.have.lengthOf(3);
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

  describe("when the mobile is displayed", () => {
    beforeEach(() => {
      stub(window, "matchMedia").returns(window.defaultMediaQueryList({ matches: true }));
    });

    it("should not render the DemoIndicator alert", () => {
      const initialState = fromJS({
        application: {
          baseLanguage: "en",
          modules: [
            {
              unique_id: "primeromodule-cp",
              name: "CP",
              associated_record_types: ["case"]
            }
          ],
          primero: {
            sandbox_ui: true
          }
        },
        records: {
          support: {
            data: {
              demo: true
            }
          }
        }
      });

      const { component: loginLayout } = setupMountedComponent(LoginLayout, {}, initialState);

      expect(loginLayout.find(DemoIndicator).find(Alert)).to.have.lengthOf(0);
    });

    afterEach(() => {
      window.matchMedia.restore();
    });
  });
});
