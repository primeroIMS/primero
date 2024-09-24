import { mountedComponent, screen } from "../../test-utils";

import NotImplemented from "./component";

describe("<NotImplemented />", () => {
  describe("when not passing a custom text", () => {
    it("renders default text", () => {
      mountedComponent(<NotImplemented />);
      expect(screen.getByText(/NOT IMPLEMENTED/i)).toBeInTheDocument();
    });
  });

  describe("when passing a custom text", () => {
    it("renders custom text", () => {
      mountedComponent(<NotImplemented text="HelloWorld" />);

      expect(screen.getByText(/NOT IMPLEMENTED /i)).toBeInTheDocument();
    });
  });
});
