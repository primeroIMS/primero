import Alert from "@material-ui/lab/Alert";

import { setupMountedComponent } from "../../test";
import { DEMO } from "../application/constants";

import DemoIndicator from "./component";

describe("<DemoIndicator />", () => {
  const props = {
    isDemo: false
  };

  describe("when isDemo is false", () => {
    const { component } = setupMountedComponent(DemoIndicator, props, {});

    it("should return null", () => {
      expect(component).to.be.empty;
    });
  });

  describe("when isDemo is true", () => {
    const { component } = setupMountedComponent(DemoIndicator, { ...props, isDemo: true }, {});

    it("should return an Alert with 'Demo' text", () => {
      expect(component.find(Alert)).to.have.lengthOf(1);
      expect(component.find(Alert).text()).to.be.equals(DEMO);
    });
  });
});
