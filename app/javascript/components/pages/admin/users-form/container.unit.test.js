import { fromJS } from "immutable";
import { Route } from "react-router-dom";

import { setupMountedComponent } from "../../../../test";
import applicationActions from "../../../application/actions";
import { ACTIONS } from "../../../../libs/permissions";
import { FormAction } from "../../../form";
import { MODES } from "../../../../config";
import UserActions from "../../../user-actions";

import UsersForm from "./container";

describe("<UsersForm />", () => {
  let component;
  const agencies = [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }];
  const permissions = {
    users: [ACTIONS.MANAGE]
  };
  const users = {
    jose: {
      id: 1,
      user_name: "jose",
      full_name: "Jose"
    },
    carlos: {
      id: 2,
      user_name: "carlos",
      full_name: "Carlos"
    }
  };
  const getVisibleFields = allFields =>
    allFields.filter(field => Object.is(field.visible, null) || field.visible).map(field => field.toJS());

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        users: {
          selectedUser: users.jose,
          data: [Object.values(users)],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      application: {
        agencies
      },
      user: {
        username: users.carlos.user_name,
        permissions
      }
    });

    ({ component } = setupMountedComponent(UsersForm, { mode: "new" }, initialState, ["/admin/users"]));
  });

  it("renders record form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("header h1").text()).to.contain("users.label");
    expect(component.find("header button").at(0).contains("buttons.cancel")).to.be.true;
    expect(component.find("header button").at(1).contains("buttons.save")).to.be.true;
  });

  it("renders 18 fields", () => {
    expect(getVisibleFields(component.find("FormSection").props().formSection.fields)).to.have.lengthOf(19);
  });

  it("renders submit button with valid props", () => {
    const saveButton = component.find(FormAction).at(1);
    const saveButtonProps = { ...saveButton.props() };

    expect(saveButton).to.have.lengthOf(1);
    ["options", "text", "savingRecord", "startIcon"].forEach(property => {
      expect(saveButtonProps).to.have.property(property);
      delete saveButtonProps[property];
    });
    expect(saveButtonProps).to.be.empty;
  });

  it("should fetch user groups and roles", () => {
    const actionTypes = component
      .props()
      .store.getActions()
      .map(action => action.type);

    expect(actionTypes.includes(applicationActions.FETCH_USER_GROUPS)).to.be.true;
    expect(actionTypes.includes(applicationActions.FETCH_ROLES)).to.be.true;
  });

  describe("when a new user is created", () => {
    const state = fromJS({
      records: {
        users: {
          data: [Object.values(users)],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      application: {
        agencies
      },
      user: {
        username: users.jose.user_name,
        permissions
      }
    });

    it("should fetch user groups and roles", () => {
      const { component: newComponent } = setupMountedComponent(UsersForm, { mode: MODES.new }, state, [
        "/admin/users/new"
      ]);

      const actionTypes = newComponent
        .props()
        .store.getActions()
        .map(action => action.type);

      expect(actionTypes.includes(applicationActions.FETCH_USER_GROUPS)).to.be.true;
      expect(actionTypes.includes(applicationActions.FETCH_ROLES)).to.be.true;
    });
  });

  describe("when currently logged-in user it equals to the selected one", () => {
    const state = fromJS({
      records: {
        users: {
          selectedUser: users.jose,
          data: [Object.values(users)],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      application: {
        agencies
      },
      user: {
        username: users.jose.user_name,
        permissions
      }
    });

    const { component: newComponent } = setupMountedComponent(UsersForm, { mode: MODES.edit }, state, [
      "/admin/users/1"
    ]);

    it("should render 16 fields", () => {
      expect(getVisibleFields(newComponent.find("FormSection").props().formSection.fields)).to.have.lengthOf(16);
    });

    it("should fetch user groups and roles", () => {
      const actionTypes = newComponent
        .props()
        .store.getActions()
        .map(action => action.type);

      expect(actionTypes.includes(applicationActions.FETCH_USER_GROUPS)).to.be.true;
      expect(actionTypes.includes(applicationActions.FETCH_ROLES)).to.be.true;
    });

    it("renders 'Change Password' link", () => {
      expect(newComponent.find("a").text()).to.be.equal("buttons.change_password");
    });
  });

  describe("when in show mode", () => {
    it("renders actions", () => {
      const initialState = fromJS({
        records: {
          users: {
            selectedUser: users.jose,
            data: [Object.values(users)],
            metadata: { total: 2, per: 20, page: 1 }
          }
        },
        application: {
          agencies
        },
        user: {
          username: users.carlos.user_name,
          permissions
        }
      });

      const TestComponent = initialProps => (
        <Route path="/admin/users/:id" component={props => <UsersForm {...{ ...props, ...initialProps }} />} />
      );

      const { component: showComponent } = setupMountedComponent(TestComponent, { mode: "show" }, initialState, [
        "/admin/users/1"
      ]);

      expect(showComponent.find(UserActions)).to.have.lengthOf(1);
    });
  });

  describe("when we use IDP", () => {
    const state = fromJS({
      records: {
        users: {
          data: [Object.values(users)],
          metadata: { total: 2, per: 20, page: 1 },
          selectedUser: users.jose
        }
      },
      application: {
        agencies
      },
      user: {
        username: users.jose.user_name,
        permissions
      },
      idp: {
        loading: false,
        use_identity_provider: true,
        identity_providers: [
          {
            domain_hint: "google.com",
            provider_type: "b2c",
            unique_id: "test",
            authorization_url: "https://test.com",
            verification_url: "https://test.com",
            name: "Test",
            client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339",
            user_domain: "test1.com",
            id: 1
          }
        ]
      }
    });

    it("should not render 'Change Password' link", () => {
      const { component: IdpComponent } = setupMountedComponent(UsersForm, { mode: MODES.edit }, state, [
        "/admin/users/edit/1"
      ]);

      expect(IdpComponent.find("a")).to.be.empty;
    });
  });
});
