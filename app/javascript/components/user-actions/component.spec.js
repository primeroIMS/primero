import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import UserActions from "./component";

describe("<UserActions>", () => {
  describe("when idp is not used", () => {
    const props = {
      id: "1"
    };

    it("should render the Menu", () => {
      mountedComponent(<UserActions {...props} />, fromJS({}));
      expect(screen.getByTestId("long-menu")).toBeInTheDocument();
    });

    it("should render the Password Reset MenuItem", () => {
      mountedComponent(<UserActions {...props} />, fromJS({}));
      expect(screen.getByText("user.password_reset_request")).toBeInTheDocument();
    });
  });

  describe("when idp is used", () => {

    const props = { id: "1" };

    it("should render the Menu", () => {
      mountedComponent(<UserActions {...props} />, fromJS({ idp: { use_identity_provider: true } }));
      expect(screen.getByTestId("long-menu")).toBeInTheDocument();
    });

    it("should not render the Password Reset MenuItem", () => {
      mountedComponent(<UserActions {...props} />, fromJS({ idp: { use_identity_provider: true } }));
      expect(screen.queryByText(/user.password_reset_request/i)).toBeNull();
    });
  });
});
