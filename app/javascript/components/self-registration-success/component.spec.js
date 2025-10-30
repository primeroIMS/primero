import { mountedComponent, screen, act } from "test-utils";

import SelfRegistrationSuccess from "./component";

describe("<SelfRegistrationSuccess />", () => {
  it("should redirect to signin if allowSelfRegistration is false or nil", async () => {
    const { history } = mountedComponent(<SelfRegistrationSuccess />);

    expect(history.location.pathname).toBe("/login");
  });

  it("should redirect to signin if allowSelfRegistration is true and user clicks on return button", async () => {
    const { history } = mountedComponent(<SelfRegistrationSuccess />, {
      application: {
        primero: {
          allow_self_registration: true
        }
      }
    });

    expect(history.location.pathname).toBe("/");
    act(() => {
      screen.getByText("self_registration.success.return_button").click();
    });
    expect(history.location.pathname).toBe("/login");
  });
});
