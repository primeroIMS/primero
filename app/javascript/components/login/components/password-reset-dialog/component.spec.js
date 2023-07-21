import { mountedComponent, screen } from "../../../../test-utils";

import PasswordResetDialog from "./component";

describe("login/components/<PasswordResetDialog />", () => {
  it("should render the password_reset_form", () => {
    mountedComponent(<PasswordResetDialog open />);
    expect(screen.getByText(/login.password_reset_modal_text/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
  });
});
