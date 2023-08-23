import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";
import { ROUTES } from "../../../../config/constants";

import RolesForm from "./container";

describe("<RolesForm />", () => {
  describe("New", () => {
    beforeEach(() => {
      const initialState = fromJS({
        records: {
          roles: {
            data: [
              {
                id: "1",
                name: {
                  en: "Role 1"
                }
              },
              {
                id: "2",
                name: {
                  en: "Role 2"
                }
              }
            ],
            metadata: { total: 2, per: 20, page: 1 }
          }
        },
        user: {
          permissions: {
            roles: [ACTIONS.MANAGE]
          }
        }
      });

      mountedComponent(<RolesForm mode="new" />, initialState, [ROUTES.admin_roles]);
    });

    it("renders role form", () => {
      expect(document.querySelector("#role-form")).toBeInTheDocument();
    });

    it("renders heading with action buttons", () => {
      expect(screen.getByText("buttons.save")).toBeInTheDocument();
      expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    });

    it("will not render actions menu", () => {
      expect(document.querySelector("#form-record-actions")).not.toBeInTheDocument();
    });
  });
});
