import { setupMountedComponent } from "../../../../../test";
import Menu from "../../../../menu";

import RolesActions from "./component";

describe("<RolesActions />", () => {
  let component;

  describe("when user can copy role", () => {
    const props = {
      canCopyRole: true,
      initialValues: { name: "Test copy role" }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RolesActions, props));
    });

    it("should render Menu", () => {
      expect(component.find(Menu)).to.have.lengthOf(1);
    });
  });

  describe("when user can copy role", () => {
    const props = {
      canCopyRole: false,
      initialValues: { name: "Test copy role" }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RolesActions, props));
    });

    it("should not render Menu", () => {
      expect(component.find(Menu)).to.be.empty;
    });
  });
});
