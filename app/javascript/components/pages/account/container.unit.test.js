import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import ChangePassword from "../admin/users-form/change-password";

import Account from "./container";

describe("<Account />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      user: {
        loading: false,
        errors: false,
        serverErrors: [],
        locale: "en",
        id: 1,
        full_name: "Test user",
        disabled: false,
        email: "primero@primero.com",
        time_zone: "UTC",
        user_name: "primero"
      },
      application: {
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }]
      }
    });

    ({ component } = setupMountedComponent(Account, { mode: "edit" }, initialState, ["/account"]));
  });

  it("renders record form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("div h1").contains("Test user")).to.be.true;
    expect(component.find("div button").at(0).contains("buttons.cancel")).to.be.true;
    expect(component.find("div button").at(1).contains("buttons.save")).to.be.true;
  });

  it("renders ChangePassword component", () => {
    expect(component.find(ChangePassword)).to.have.length(1);
  });
});
