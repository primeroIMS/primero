import { mountedComponent, screen } from "../../test-utils";

import Login from "./component";

describe("<Login />", () => {
  describe("for login form", () => {
    it("renders form", () => {
      mountedComponent(<Login />, {
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      });

      expect(screen.queryByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
    });
  });

  describe("for provider selection", () => {
    it("renders login selection", () => {
      mountedComponent(<Login />, {
        idp: {
          use_identity_provider: true,
          identity_providers: [
            {
              name: "UNICEF",
              type: "b2c",
              domain_hint: "unicef",
              authority: "authority",
              client_id: "clientid",
              scope: ["scope"],
              redirect_uri: "redirect"
            }
          ]
        }
      });

      expect(document.querySelector(".idpSelectContainer")).toBeInTheDocument();
    });
  });
});
