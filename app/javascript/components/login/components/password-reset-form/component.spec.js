import { mountedComponent, screen } from "../../../../test-utils";

import PasswordResetForm from "./component";

describe("<PasswordResetForm />", () => {
  it("does not render action buttons when modal is true", () => {
    mountedComponent(<PasswordResetForm modal />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders action buttons when modal is false", () => {
    mountedComponent(<PasswordResetForm modal={false} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
