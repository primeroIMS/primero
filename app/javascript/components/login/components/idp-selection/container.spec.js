import { mountedComponent, screen } from "../../../../test-utils";

import LoginSelection from "./container";

describe("<LoginSelection />", () => {
  it("renders login PrimeroIdpSelect for providers", () => {
    mountedComponent(<LoginSelection isAuthenticated={false} />, {
      idp: {
        use_identity_provider: true,
        identity_providers: [
          {
            name: "unicef",
            provider_type: "b2c",
            unique_id: "unicef",
            authorization_url: "authority",
            client_id: "clientid",
            identity_scope: ["scope"],
            domain_hint: "unicef"
          },
          {
            name: "primero",
            provider_type: "b2c",
            unique_id: "primeroims",
            authorization_url: "authority",
            client_id: "clientid",
            identity_scope: ["scope"],
            domain_hint: "primero"
          }
        ]
      }
    });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders a link for primeroims provider", () => {
    mountedComponent(<LoginSelection isAuthenticated={false} />, {
      idp: {
        use_identity_provider: true,
        identity_providers: [
          {
            name: "unicef",
            provider_type: "b2c",
            unique_id: "unicef",
            authorization_url: "authority",
            client_id: "clientid",
            identity_scope: ["scope"],
            domain_hint: "unicef"
          },
          {
            name: "primero",
            provider_type: "b2c",
            unique_id: "primeroims",
            authorization_url: "authority",
            client_id: "clientid",
            identity_scope: ["scope"],
            domain_hint: "primero"
          }
        ]
      }
    });
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "a")).toBeInTheDocument();
  });

  describe("when primeroims is the only one", () => {
    it("renders forms components", () => {
      mountedComponent(<LoginSelection />, {
        idp: {
          use_identity_provider: true,
          identity_providers: [
            {
              name: "primero",
              provider_type: "b2c",
              unique_id: "primeroims",
              authorization_url: "authority",
              client_id: "clientid",
              identity_scope: ["scope"],
              domain_hint: "primero"
            }
          ]
        }
      });
      expect(screen.getByText(/login.title/i)).toBeInTheDocument();
      expect(screen.getByText(/log_in_primero_idp/i)).toBeInTheDocument();
    });
  });
});
