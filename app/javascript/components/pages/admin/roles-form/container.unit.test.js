import { fromJS } from "immutable";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  setupMountedComponent,
  setupMockFormComponent
} from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { ActionsMenu } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { ROUTES } from "../../../../config/constants";

import RolesForm from "./container";

describe("<RolesForm />", () => {
  let component;

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

      ({ component } = setupMountedComponent(
        RolesForm,
        { mode: "new" },
        initialState,
        [ROUTES.admin_roles]
      ));
    });

    it("renders role form", () => {
      expect(component.find("form")).to.have.lengthOf(1);
    });

    it("renders heading with action buttons", () => {
      expect(component.find("header h1").contains("role.label ")).to.be.true;
      expect(component.find("header button").at(0).contains("buttons.cancel"))
        .to.be.true;
      expect(component.find("header button").at(1).contains("buttons.save")).to
        .be.true;
    });

    it("will not render actions menu", () => {
      expect(component.find(ActionsMenu)).to.have.lengthOf(0);
    });
  });

  describe("Show", () => {
    beforeEach(() => {
      const initialState = fromJS({
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
          formSections: [
            {
              unique_id: "form_1",
              fields: [
                {
                  name: "field_1"
                }
              ]
            }
          ]
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

      ({ component } = setupMockFormComponent(
        RolesForm,
        { mode: "show" },
        {},
        initialState,
        ["/admin/roles/10"]
      ));
    });

    it("renders role form sections", () => {
      expect(component.find(FormSection)).to.have.lengthOf(6);
    });

    it("renders heading with action menu", () => {
      expect(component.find(ActionsMenu)).to.have.lengthOf(1);
    });

    it("renders the selected modules", () => {
      const autocomplete = component.find(Autocomplete);

      expect(
        autocomplete
          .map(current => current.props())
          .find(
            props =>
              props.name === "module_unique_ids" &&
              props.value.includes("primeromodule-cp")
          )
      ).to.exist;
    });
  });
});
