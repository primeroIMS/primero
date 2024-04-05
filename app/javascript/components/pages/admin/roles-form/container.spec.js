import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";
import { ROUTES } from "../../../../config/constants";
import { FormSectionRecord } from "../../../form/records";

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
  describe("Show", () => {
    beforeEach(() => {
      const state = fromJS({
        records: {
          admin: {
            roles: {
              selectedRole: {
                id: 10,
                name: "Test Role",
                module_unique_ids: ["primeromodule-cp"]
              },
              loading: false,
              errors: false,
              serverErrors: []
            }
          }
        },
        forms: {
          formSections: {
            1: FormSectionRecord({
              id: 1,
              unique_id: "form_1",
              fields: [
                {
                  name: "field_1"
                }
              ],
              visible: true,
              is_nested: false,
              parent_form: "case",
              module_ids: ["primeromodule-cp"]
            }),
            2: FormSectionRecord({
              id: 2,
              unique_id: "core_form_1",
              fields: [],
              visible: true,
              is_nested: false,
              core_form: true,
              parent_form: "case",
              module_ids: ["primeromodule-cp"]
            })
          }
        },
        user: {
          permissions: {
            roles: [ACTIONS.MANAGE]
          }
        },
        application: {
          modules: [
            {
              unique_id: "primeromodule-cp"
            }
          ]
        }
      });

      mountedComponent(<RolesForm mode="show" />, state, ["/admin/roles/10"]);
    });

    xit("renders role form sections", () => {
      const formSections = screen.getAllByTestId("form-section");

      expect(formSections).toHaveLength(8);
    });

    it("renders core forms disabled and empty", () => {
      const disabledInputs = screen.getAllByRole("textbox", { class: "Mui-disabled" });

      expect(disabledInputs.length).toBeGreaterThan(0);
    });

    xit("renders the selected modules", () => {
      const autocomplete = screen.getAllByTestId("autocomplete");
      const selectedModuleExists = autocomplete
        .map(element => element.props())
        .some(props => props.name === "module_unique_ids" && props.value.includes("primeromodule-cp"));

      expect(selectedModuleExists).toBeTruthy();
    });

    it("renders the roles-actions component", () => {
      expect(document.querySelector("#long-menu")).toBeInTheDocument();
    });
  });
});
