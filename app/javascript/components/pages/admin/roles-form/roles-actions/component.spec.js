import { mountedComponent } from "test-utils";

import RolesActions from "./component";

describe("<RolesActions />", () => {
  describe("when user can copy role", () => {
    const props = {
      canCopyRole: true,
      initialValues: { name: "Test copy role" }
    };

    beforeEach(() => {
      mountedComponent(<RolesActions {...props} />);
    });

    it("should render Menu", () => {
      expect(document.querySelector("#long-menu")).toBeInTheDocument();
    });
  });

  describe("when user can copy role", () => {
    const props = {
      canCopyRole: false,
      initialValues: { name: "Test copy role" }
    };

    beforeEach(() => {
      mountedComponent(<RolesActions {...props} />);
    });

    it("should not render Menu", () => {
      expect(document.querySelector("#long-menu")).not.toBeInTheDocument();
    });
  });
});
