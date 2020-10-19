import { fromJS } from "immutable";
import { AppBar, Toolbar, IconButton, Hidden } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import ModuleLogo from "../module-logo";

import MobileToolbar from "./component";

describe("<MobileToolbar />", () => {
  let component;
  const state = fromJS({ MobileToolbar: { module: "primero" } });
  const props = { openDrawer: () => {} };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MobileToolbar, props, state));
  });

  it("should render Hidden component", () => {
    expect(component.find(Hidden)).to.have.lengthOf(1);
  });
  it("should render AppBar component", () => {
    expect(component.find(AppBar)).to.have.lengthOf(1);
  });

  it("should render Toolbar component", () => {
    expect(component.find(Toolbar)).to.have.lengthOf(1);
  });

  it("should render IconButton component", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("should render ModuleLogo component", () => {
    expect(component.find(ModuleLogo)).to.have.lengthOf(1);
  });

  describe("when is not demo site", () => {
    it("should not render a <p> tag with 'Demo' text", () => {
      expect(component.find("p")).to.be.empty;
    });
  });

  describe("when is demo site", () => {
    const stateWithDemo = fromJS({
      records: {
        support: {
          data: {
            demo: true
          }
        }
      }
    });
    const { component: componentWithDemo } = setupMountedComponent(MobileToolbar, props, stateWithDemo);

    it("should render a <p> tag with 'Demo' text", () => {
      expect(componentWithDemo.find("p")).to.have.lengthOf(1);
    });
  });
});
