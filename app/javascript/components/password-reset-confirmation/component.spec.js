import { mountedComponent, screen } from "../../test-utils";

import PasswordResetConfirmation from "./component";

describe("<PasswordResetConfirmation>", () => {
  it("should render the ActionDialog", () => {
    mountedComponent(<PasswordResetConfirmation open />);
    expect(screen.getByText(/user.password_reset_header/i)).toBeInTheDocument();
  });

  it("should render the text", () => {
    mountedComponent(<PasswordResetConfirmation open />);
    expect(screen.getByText(/user.password_reset_text/i)).toBeInTheDocument();
  });
});
