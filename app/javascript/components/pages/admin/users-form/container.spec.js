import { fromJS } from "immutable";

import { mountedComponent, screen, within } from "../../../../test-utils";
import { ACTIONS } from "../../../permissions";

import UsersForm from "./container";

describe("<UsersForm />", () => {
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

  it("renders record form", () => {
    mountedComponent(<UsersForm mode="new" />, initialState, {}, ["/admin/users"]);
    expect(screen.getByTestId("form")).toBeInTheDocument();
  });

  it("renders heading with action buttons", () => {
    mountedComponent(<UsersForm mode="new" />, initialState, {}, ["/admin/users"]);
    expect(screen.getByText(/users.label/i)).toBeInTheDocument();
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    expect(screen.getByText("buttons.save")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    mountedComponent(<UsersForm mode="new" />, initialState, {}, ["/admin/users"]);

    expect(screen.getAllByRole("button")[1].getAttribute("type")).toEqual("submit");
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

    it("renders 'Change Password' link", () => {
      mountedComponent(<UsersForm mode="edit" />, state, {}, ["/admin/users/1"], {}, "/admin/users/:id");
      expect(screen.getByText("buttons.change_password")).toBeInTheDocument();
    });
  });

  describe("when in show mode", () => {
    it("renders actions", () => {
      const stateForShowMode = fromJS({
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

      mountedComponent(<UsersForm mode="show" />, stateForShowMode, {}, ["/admin/users/1"], {}, "/admin/users/:id");

      expect(within(screen.getByTestId("page-heading")).getAllByRole("button")[1].id).toEqual("more-actions");
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
      mountedComponent(<UsersForm mode="edit" />, state, {}, ["/admin/users/edit/1"], {}, "/admin/users/edit/:id");
      expect(screen.queryByText("buttons.change_password")).toBeNull();
    });
  });
});
