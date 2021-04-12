import { setupMountedComponent } from "../../../test";
import Jewel from "../../jewel";

import AdminNavItem from "./admin-nav-item";

describe("<AdminNavItem />", () => {
  describe("when the user has access to admin-nav-item entry", () => {
    const props = {
      item: {
        label: "Users",
        to: "/users"
      },
      renderJewel: true
    };

    const { component } = setupMountedComponent(AdminNavItem, props);

    it("should render AdminNavItem", () => {
      expect(component.find(AdminNavItem)).to.have.lengthOf(1);
    });

    it("should render a Jewel component", () => {
      expect(component.find(Jewel)).to.have.lengthOf(1);
    });
  });
});
