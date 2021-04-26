import { fromJS } from "immutable";
import Button from "@material-ui/core/Button";

import { PageHeading } from "../../../page";
import ActionButton from "../../../action-button";
import { setupMountedComponent } from "../../../../test";

import LoginForm from "./component";

describe("<LoginForm />", () => {
  const props = { isAuthenticated: false };
  let component;

  before(() => {
    component = setupMountedComponent(
      LoginForm,
      props,
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
    ).component;
  });

  it("renders form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders h1 tag", () => {
    expect(component.find("h1")).to.have.length(1);
  });

  it("renders username and password input fields", () => {
    expect(component.find("input").first().prop("name")).to.have.equal("user_name");
    expect(component.find("input").last().prop("name")).to.have.equal("password");
  });

  // TODO: Temp removal
  // it("renders forgot password link", () => {
  //   expect(
  //     component
  //       .find("a")
  //       .first()
  //       .prop("href")
  //   ).to.have.equal("/forgot_password");
  // });

  it("renders login button", () => {
    expect(component.find("button").first().prop("type")).to.equal("submit");
  });

  describe("when is demo site", () => {
    const stateWithDemo = fromJS({
      application: {
        primero: {
          sandbox_ui: true
        }
      }
    });
    const { component: componentWithDemo } = setupMountedComponent(LoginForm, props, stateWithDemo);

    it("should render PageHeading with 'demo' text", () => {
      expect(componentWithDemo.find(PageHeading).text()).to.be.equal("sandbox_ui login.label");
    });

    it("should render ActionButton with 'demo' text", () => {
      expect(componentWithDemo.find(ActionButton).text()).to.equal("buttons.login logger.to sandbox_ui");
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
    const { component: componentWithDemo } = setupMountedComponent(LoginForm, props, stateWithoutExternal);

    it("renders the forgot password link", () => {
      expect(componentWithDemo.find(Button).last().text()).to.be.equal("login.forgot_password");
    });
  });
});
