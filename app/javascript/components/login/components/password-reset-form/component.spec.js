import { mountedComponent, screen } from "../../../../test-utils";

import PasswordResetForm from "./component";

describe("<PasswordResetForm />", () => {
  it("does not render action buttons when modal is true", () => {
    mountedComponent(<PasswordResetForm modal />);
    expect(screen.getByText(/login.password_reset_modal_text/i)).toBeInTheDocument();
  });

  it("renders action buttons when modal is false", () => {
    mountedComponent(<PasswordResetForm modal />);
    expect(screen.queryByText(/buttons.ok/i)).toBeNull();
    expect(screen.queryByText(/buttons.cancel/i)).toBeNull();
  });
});
