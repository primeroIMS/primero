import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import LoginForm from "./component";

describe("<LoginForm />", () => {
  const props = { isAuthenticated: false };

  it("renders form", () => {
    mountedComponent(
      <LoginForm {...props} />,
      fromJS({
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      })
    );
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
  });

  it("renders h1 tag", () => {
    mountedComponent(
      <LoginForm {...props} />,
      fromJS({
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      })
    );

    expect(screen.getByRole("heading", { name: "login.label" })).toBeInTheDocument();
  });

  it("renders username and password input fields", () => {
    mountedComponent(
      <LoginForm {...props} />,
      fromJS({
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      })
    );
    expect(screen.getByRole("textbox", { name: /login.username/i })).toBeInTheDocument();
    expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
  });

  it("renders login button", () => {
    mountedComponent(
      <LoginForm {...props} />,
      fromJS({
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      })
    );
    expect(screen.getByText(/buttons.login/)).toBeInTheDocument();
  });

  describe("when is demo site", () => {
    const stateWithDemo = fromJS({
      application: {
        primero: {
          sandbox_ui: true
        }
      }
    });

    it("should render PageHeading with 'demo' text", () => {
      mountedComponent(<LoginForm {...props} />, stateWithDemo);
      expect(screen.getByText("sandbox_ui login.label")).toBeInTheDocument();
    });

    it("should render ActionButton with 'demo' text", () => {
      mountedComponent(<LoginForm {...props} />, stateWithDemo);
      expect(screen.getByText("buttons.login logger.to sandbox_ui")).toBeInTheDocument();
    });
  });

  describe("when does not use external identity", () => {
    const stateWithoutExternal = fromJS({
      application: {
        primero: {
          sandbox_ui: true
        }
      },
      idp: {
        use_identity_provider: false
      }
    });

    it("renders the forgot password link", () => {
      mountedComponent(<LoginForm {...props} />, stateWithoutExternal);
      expect(screen.getByText(/login.forgot_password/i)).toBeInTheDocument();
    });
  });
});
