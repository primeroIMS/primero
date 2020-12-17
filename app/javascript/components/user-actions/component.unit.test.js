import { fromJS } from "immutable";
import { MenuItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import Menu from "../menu";

import UserActions from "./component";

describe("<UserActions>", () => {
  describe("when idp is not used", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(UserActions, { id: "1" }, fromJS({})));
    });

    it("should render the Menu", () => {
      expect(component.find(Menu)).to.have.lengthOf(1);
    });

    it("should render the Password Reset MenuItem", () => {
      expect(
        component
          .find(MenuItem)
          .map(node => node.text())
          .includes("user.password_reset_request")
      ).to.be.true;
    });
  });

  describe("when idp is used", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        UserActions,
        { id: "1" },
        fromJS({ idp: { use_identity_provider: true } })
      ));
    });

    it("should render the Menu", () => {
      expect(component.find(Menu)).to.have.lengthOf(1);
    });

    it("should not render the Password Reset MenuItem", () => {
      expect(
        component
          .find(MenuItem)
          .map(node => node.text())
          .includes("user.password_reset_request")
      ).to.be.false;
    });
  });
});
